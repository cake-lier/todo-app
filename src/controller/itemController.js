"use strict";

const User = require("../model/userModel.js").createUserModel();
const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const { Error, validateRequest, sendError } = require("../utils/validation");
const mongoose = require("mongoose");
const { scheduleNextReminder, scheduleForDate } = require("../utils/schedule");

function createItem(request, response) {
    if (!validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    const userId = request.session.userId;
    if (userId === undefined && !request.body.anonymousId) {
        sendError(response, Error.RequestError);
        return;
    }
    List.startSession()
        .then(session => session.withTransaction(() =>
            List.findOne(
                {
                    _id: request.params.id,
                    members: { $elemMatch: userId !== undefined ? { userId } : { anonymousId: request.body.anonymousId } }
                },
                undefined,
                { session }
            )
            .exec()
            .then(list => {
                if (list === null) {
                    sendError(response, Error.RequestError);
                    return Promise.resolve();
                }
                return Item.create({
                    listId: request.params.id,
                    title: request.body.title,
                    text: request.body.text,
                    dueDate: request.body.dueDate,
                    reminderString: request.body.reminderString,
                    tags: request.body.tags,
                    count: request.body.count,
                    remainingCount: request.body.count
                })
                .then(item => {
                    const listId = list._id.toString();
                    const text = `The item "${ item.title }" was added to the list "${ list.title }"`;
                    Notification.create({
                        users: list.members
                                   .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                   .map(m => m.userId),
                        text,
                        listId
                    })
                    .catch(error => console.log(error))
                    .then(_ => {
                        io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemCreated", listId, text);
                        io.in(`list:${ listId }`).emit("itemCreatedReload", listId);
                        response.json(item);
                    });
                });
            })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
}

function getUserItems(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    List.aggregate([
        { $match: { members: { $elemMatch: { userId: mongoose.Types.ObjectId(request.session.userId) } } } },
        { $lookup: { from: "items", localField: "_id", foreignField: "listId", as: "items" } },
        { $unwind: "$items" },
        { $replaceRoot: { newRoot: "$items" } }
    ])
    .exec()
    .then(
        items => response.json(items),
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getListItems(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    List.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(request.params.id),
                members: {
                    $elemMatch:
                        request.session.userId !== undefined
                        ? { userId: request.session.userId }
                        : { anonymousId: request.body.anonymousId }
                }
            }
        },
        { $lookup: { from: "items", localField: "_id", foreignField: "listId", as: "items" } },
        { $unwind: "$items" },
        { $replaceRoot: { newRoot: "$items" } }
    ])
    .exec()
    .then(
        items => response.json(items),
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getAssignees(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    if (userId === undefined && !request.body.anonymousId) {
        sendError(response, Error.RequestError);
        return;
    }
    Item.startSession()
        .then(session => session.withTransaction(() =>
            Item.aggregate(
                [
                    { $match: { _id: mongoose.Types.ObjectId(request.params.id) } },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: { $arrayElemAt: [ "$lists", 0 ] } } },
                    {
                        $match: {
                            members: {
                                $elemMatch:
                                    userId !== undefined
                                        ? { userId: mongoose.Types.ObjectId(userId) }
                                        : { anonymousId: request.body.anonymousId }
                            }
                        }
                    }
                ],
                { session }
            )
            .exec()
            .then(lists => {
                if (lists.length === 0) {
                    sendError(response, Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return Item.findById(request.params.id, { session })
                           .exec()
                           .then(item => {
                               if (item === null) {
                                   sendError(response, Error.ResourceNotFound);
                                   return Promise.resolve();
                               }
                               return Promise.all(item.assignees.map(assignee => {
                                   if (assignee.anonymousId !== null) {
                                       return Promise.resolve({
                                               _id: assignee._id,
                                               username: lists[0].members
                                                                 .filter(m => m.anonymousId === assignee.anonymousId)[0]
                                                                 .username,
                                               count: assignee.count,
                                               profilePicturePath: null
                                       });
                                   }
                                   return User.findById(assignee.userId, undefined, { session })
                                           .exec()
                                           .then(user => {
                                               if (user === null) {
                                                   return Promise.resolve(null);
                                               }
                                               return Promise.resolve({
                                                   _id: assignee._id,
                                                   username: user.username,
                                                   count: assignee.role,
                                                   profilePicturePath:
                                                       user.profilePicturePath === null
                                                       ? null
                                                       : "/static" + user.profilePicturePath
                                               });
                                           });
                                   }))
                                   .then(members => response.json(members.filter(m => m !== null)));
                           });
            })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
}

function updateItemProperty(request, response, onSuccess) {
    const userId = request.session.userId;
    if (userId === undefined && !request.body.anonymousId) {
        sendError(response, Error.RequestError);
        return;
    }
    List.startSession()
        .then(session => session.withTransaction(() =>
            Item.aggregate(
                [
                    { $match: { _id: mongoose.Types.ObjectId(request.params.id) } },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: { $arrayElemAt: [ "$lists", 0 ] } } },
                    {
                        $match: {
                            members: {
                                $elemMatch:
                                    userId !== undefined
                                    ? { userId: mongoose.Types.ObjectId(userId) }
                                    : { anonymousId: request.body.anonymousId }
                            }
                        }
                    }
                ],
                { session }
            )
            .exec()
            .then(lists => {
                if (lists.length === 0) {
                    sendError(response, Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return onSuccess(session, lists[0]);
            })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
}

function updateItemAtomicProperty(request, response, updateObject, onSuccess, optionsObject = { new: true }) {
    updateItemProperty(
        request,
        response,
        (session, list) =>
            Item.findByIdAndUpdate(
                request.params.id,
                updateObject,
                Object.assign({ runValidators: true, context: "query", session }, optionsObject)
            )
            .exec()
            .then(item => {
                if (item === null) {
                    sendError(response, Error.ResourceNotFound);
                } else {
                    onSuccess(list, item);
                }
                return Promise.resolve();
            })
    );
}

function updateTitle(request, response) {
    if (!validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $set: { title: request.body.title } },
        (list, item) => {
            const listId = list._id.toString();
            const text = `The item "${ item.title }" had its title changed to "${ request.body.title }"`;
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTitleChanged", listId, text);
                io.in(`list:${ listId }`).emit("itemTitleChangedReload", listId);
                const updatedItem = JSON.parse(JSON.stringify(item));
                updatedItem.title = request.body.title;
                response.json(updatedItem);
            });
        },
        { new: false }
    );
}

function updateText(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.text ? { $set: { text: request.body.text } } : { $unset: { text: "" } },
        (list, item) => {
            const listId = list._id.toString();
            const text = `The item "${ item.title }" had its text changed`;
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTextChanged", listId, text);
                io.in(`list:${ listId }`).emit("itemTextChangedReload", listId);
                response.json(item);
            });
        },
    );
}

function updateDate(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    if (request.body.dueDate !== undefined && request.body.reminderString !== undefined) {
        sendError(response, Error.RequestError);
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.dueDate === undefined && request.body.reminderString === undefined
        ? { $set: { dueDate: "", reminderString: "" } }
        : (request.body.dueDate === undefined
           ? { $set: { reminderString: request.body.reminderString, dueDate: "" } }
           : { $set: { dueDate: request.body.dueDate, reminderString: "" } }),
        (list, item) => {
            const listId = list._id.toString();
            const text =
                request.body.dueDate !== undefined
                ? `The item "${ item.title }" has now a due date, possible reminders have been cleared`
                : (request.body.reminderString !== undefined
                   ? `The item "${ item.title }" has now a reminder set, possible due dates have been cleared`
                   : `The item "${ item.title }" has now neither a due date nor a reminder`);
            const itemId = item._id.toString();
            jobs[itemId]?.cancel();
            if (request.body.dueDate !== undefined) {
                scheduleForDate(itemId, request.body.dueDate);
            }
            if (request.body.reminderString !== undefined) {
                scheduleNextReminder(listId, itemId, request.body.reminderString);
            }
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemDateChanged", listId, text);
                io.in(`list:${ listId }`).emit("itemDateChangedReload", listId);
                response.json(item);
            });
        }
    );
}

function updateCompletion(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.isComplete ? { $set: { completionDate: Date.now() } } : { $set: { completionDate: "" } },
        (list, item) => {
            const listId = list._id.toString();
            const text = `The item "${item.title}" is now set as ${request.body.isComplete ? "" : "in"}complete`;
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${listId}`).except(`user:${ request.session.userId }`).emit("itemCompletionChanged", listId, text);
                io.in(`list:${listId}`).emit("itemCompletionChangedReload", listId);
                response.json(item);
            });
        }
    );
}

function addTags(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $addToSet: { tags: { $each: request.body.title ? [{title: request.body.title, colorIndex: request.body.colorIndex}] : [] } } },
        //{$push: {tags: {text: request.body.title, colorIndex: request.body.colorIndex}}},
        (list, item) => {
            const listId = list._id.toString();
            const text = `Some tags have been added to the item "${item.title}"`;
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTagsAdded", listId, text);
                io.in(`list:${ listId }`).emit("itemTagsAddedReload", listId);
                response.json(item);
            });
        }
    );
}

function removeTags(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $pullAll: { tags: request.body.tags ? request.body.tags : [] } },
        (list, item) => {
            const listId = list._id.toString();
            const text = `Some tags have been removed from the item "${item.title}"`;
            Notification.create({
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTagsRemoved", listId, text);
                io.in(`list:${ listId }`).emit("itemTagsRemovedReload", listId);
                response.json(item);
            });
        }
    );
}

function updateCount(request, response) {
    if (!validateRequest(request, response, ["count"], ["id"])) {
        return;
    }
    updateItemProperty(
        request,
        response,
        (session, list) =>
            Item.findById(request.params.id, undefined, { session })
                .exec()
                .then(item => {
                    if (item === null || item.count - request.body.count > item.remainingCount) {
                        sendError(response, Error.RequestError);
                        return Promise.resolve();
                    }
                    return Item.findByIdAndUpdate(
                        request.params.id,
                        {
                            $set: {
                                count: request.body.count,
                                remainingCount: item.remainingCount - (item.count - request.body.count)
                            }
                        },
                        { runValidators: true, new: true, context: "query", session }
                    )
                    .exec()
                    .then(item => {
                        if (item === null) {
                            sendError(response, Error.ResourceNotFound);
                        } else {
                            const listId = list._id.toString();
                            const text = `The item "${item.title}" had its count updated`;
                            Notification.create({
                                users: list.members
                                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                           .map(m => m.userId),
                                text,
                                listId
                            })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`)
                                  .except(`user:${ request.session.userId }`)
                                  .emit("itemCountChanged", listId, text);
                                io.in(`list:${ listId }`).emit("itemCountChangedReload", listId);
                                response.json(item);
                            });
                        }
                        return Promise.resolve();
                    })
                })
    );
}

function addAssignee(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["userId", "isAnonymous", "count"], ["id"])) {
        return;
    }
    if (userId === undefined && !request.body.anonymousId) {
        sendError(response, Error.RequestError);
        return;
    }
    List.startSession()
        .then(session => session.withTransaction(() =>
            Item.aggregate(
                [
                    { $match: { _id: mongoose.Types.ObjectId(request.params.id) } },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: { $arrayElemAt: [ "$lists", 0 ] } } },
                    {
                        $match: {
                            $and: [
                                {
                                    members: {
                                        $elemMatch: userId !== undefined ? { userId } : { anonymousId: request.body.anonymousId }
                                    },
                                },
                                {
                                    members: {
                                        $elemMatch:
                                            request.body.isAnonymous
                                            ? { anonymousId: request.body.userId }
                                            : { userId: request.body.userId }
                                    }
                                }
                            ]
                        }
                    }
                ],
                { session }
            )
            .exec()
            .then(lists => {
                if (lists.length === 0) {
                    sendError(response, Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return Item.findById(request.params.id, undefined, { session })
                           .exec()
                           .then(item => {
                               if (item === null || item.remainingCount < request.body.count) {
                                   sendError(response, Error.ResourceNotFound);
                                   return Promise.resolve();
                               }
                               return Item.findByIdAndUpdate(
                                   request.params.id,
                                   {
                                       remainingCount: item.remainingCount - request.body.count,
                                       $push: {
                                           assignees:
                                               request.body.isAnonymous
                                               ? { anonymousId: request.body.userId, count: request.body.count }
                                               : { userId: request.body.userId, count: request.body.count }
                                       }
                                   },
                                   { session, runValidators: true, new: true, context: "query" }
                               )
                               .exec()
                               .then(item => {
                                   if (item === null) {
                                       sendError(response, Error.ResourceNotFound);
                                   } else {
                                       const listId = lists[0]._id.toString();
                                       const text = `An assignee was added to the item "${item.title}"`;
                                       Notification.create({
                                           users: lists[0].members
                                                          .filter(m => m.userId !== null
                                                                       && m.userId.toString() !== request.session.userId)
                                                          .map(m => m.userId),
                                           text,
                                           listId
                                       })
                                       .catch(error => console.log(error))
                                       .then(_ => {
                                           io.in(`list:${ listId }`)
                                             .except(`user:${ request.session.userId }`)
                                             .emit("itemAssigneeAdded", listId, text);
                                           io.in(`list:${ listId }`).emit("itemAssigneeAddedReload", listId);
                                           response.json(item);
                                       });
                                   }
                                   return Promise.resolve();
                               });
                           });
            })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
}

function removeAssignee(request, response) {
    if (!validateRequest(request, response, [], ["id", "assigneeId"])) {
        return;
    }
    const assigneeId = request.params.assigneeId;
    updateItemProperty(
        request,
        response,
        (session, list) =>
            Item.findOne(
                { _id: request.params.id, assignees: { $elemMatch: { _id: assigneeId } } },
                undefined,
                { session }
            )
            .exec()
            .then(item => {
                if (item === null) {
                    return Promise.resolve(null);
                }
                return Item.findByIdAndUpdate(
                    request.params.id,
                    {
                        $set: {
                            remainingCount: item.remainingCount + item.assignees.find(a => a._id.toString() === assigneeId).count,
                        },
                        $pull: { assignees: { _id: assigneeId } }
                    },
                    { runValidators: true, new: true, session, context: "query" }
                )
                .exec()
                .then(item => {
                    if (item === null) {
                        sendError(response, Error.ResourceNotFound);
                    } else {
                        const listId = list._id.toString();
                        const text = `An assignee was removed from the item "${ item.title }"`;
                        Notification.create({
                            users: list.members
                                       .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                       .map(m => m.userId),
                            text,
                            listId
                        })
                        .catch(error => console.log(error))
                        .then(_ => {
                            io.in(`list:${ listId }`)
                              .except(`user:${ request.session.userId }`)
                              .emit("itemAssigneeRemoved", listId, text);
                            io.in(`list:${ listId }`).emit("itemAssigneeRemovedReload", listId);
                            response.json(item);
                        });
                    }
                    return Promise.resolve();
                })
            })
    );
}

function deleteItem(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemProperty(
        request,
        response,
        (session, list) =>
            Item.findByIdAndDelete(request.params.id, { session })
                .exec()
                .then(item => {
                    if (item === null) {
                        sendError(response, Error.ResourceNotFound);
                    } else {
                        jobs[item._id.toString()]?.cancel();
                        const listId = list._id.toString();
                        const text = `The item "${item.title}" was deleted`;
                        Notification.create({
                            users: list.members
                                       .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                       .map(m => m.userId),
                            text,
                            listId
                        })
                        .catch(error => console.log(error))
                        .then(_ => {
                            io.in(`list:${ listId }`)
                              .except(`user:${ request.session.userId }`)
                              .emit("itemDeleted", listId, text);
                            io.in(`list:${ listId }`).emit("itemDeletedReload", listId);
                            response.json(item);
                        });
                    }
                    return Promise.resolve();
                })
    );
}

function updatePriority(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    if (typeof request.body.priority !== 'boolean') {
        sendError(response, Error.RequestError);
    }
    updateItemAtomicProperty(
        request,
        response,
        { $set: { priority: request.body.priority} }
    );
}

module.exports = {
    createItem,
    getUserItems,
    getListItems,
    updateTitle,
    updateText,
    updateDate,
    updateCompletion,
    addTags,
    removeTags,
    updateCount,
    addAssignee,
    removeAssignee,
    getAssignees,
    updatePriority,
    deleteItem
}
