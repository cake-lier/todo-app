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
                    User.findById(request.session.userId)
                        .exec()
                        .then(
                            user => {
                                const authorUsername = user.username;
                                const authorProfilePicturePath = user.profilePicturePath;
                                const listId = list._id.toString();
                                const text = `${authorUsername} created the new item "${ item.title }`;
                                Notification.create({
                                    authorUsername,
                                    authorProfilePicturePath,
                                    users: list.members
                                        .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                        .map(m => m.userId),
                                    text,
                                    listId,
                                    listTitle: list.title
                                })
                                    .catch(error => console.log(error))
                                    .then(_ => {
                                        io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemCreated", listId, text);
                                        io.in(`list:${ listId }`).emit("itemCreatedReload", listId);
                                        response.json(item);
                                    });
                            },
                            error => console.log(error)
                        )
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
                        ? { userId: mongoose.Types.ObjectId(request.session.userId) }
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} changed the title of the item "${ item.title }" to "${ request.body.title }"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
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
                    error => console.log(error)
                )
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} changed the text of the item "${ item.title }"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTextChanged", listId, text);
                                io.in(`list:${ listId }`).emit("itemTextChangedReload", listId);
                                response.json(item);
                            });

                    },
                    error => console.log(error)
                )
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text =
                            request.body.dueDate !== undefined
                                ? `${authorUsername} set a due date to the item "${ item.title }"; possible reminders have been cleared`
                                : (request.body.reminderString !== undefined
                                    ? `${authorUsername} set a reminder set to the item "${ item.title }"; possible due dates have been cleared`
                                    : `${authorUsername} removed any due date or reminder from the item "${ item.title }"`);
                        const itemId = item._id.toString();
                        jobs[itemId]?.cancel();
                        if (request.body.dueDate !== undefined) {
                            scheduleForDate(itemId, request.body.dueDate);
                        }
                        if (request.body.reminderString !== undefined) {
                            scheduleNextReminder(listId, itemId, request.body.reminderString);
                        }
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemDateChanged", listId, text);
                                io.in(`list:${ listId }`).emit("itemDateChangedReload", listId);
                                response.json(item);
                            });

                    },
                    error => console.log(error)
                )
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} set the item "${item.title}" as ${request.body.isComplete ? "" : "in"}complete`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${listId}`).except(`user:${ request.session.userId }`).emit("itemCompletionChanged", listId, text);
                                io.in(`list:${listId}`).emit("itemCompletionChangedReload", listId);
                                response.json(item);
                            });
                    },
                    error => console.log(error)
                )
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} added some tags to the item "${item.title}"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTagsAdded", listId, text);
                                io.in(`list:${ listId }`).emit("itemTagsAddedReload", listId);
                                response.json(item);
                            });

                    },
                    error => console.log(error)
                )
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
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} removed some tags from the item "${item.title}"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemTagsRemoved", listId, text);
                                io.in(`list:${ listId }`).emit("itemTagsRemovedReload", listId);
                                response.json(item);
                            });

                    },
                    error => console.log(error)
                )
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
                        mongoose.Types.ObjectId(request.params.id),
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
                            User.findById(request.session.userId)
                                .exec()
                                .then(
                                    user => {
                                        const authorUsername = user.username;
                                        const authorProfilePicturePath = user.profilePicturePath;
                                        const listId = list._id.toString();
                                        const text = `${authorUsername} changed the count of the item "${item.title}"`;
                                        Notification.create({
                                            authorUsername,
                                            authorProfilePicturePath,
                                            users: list.members
                                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                                .map(m => m.userId),
                                            text,
                                            listId,
                                            listTitle: list.title
                                        })
                                            .catch(error => console.log(error))
                                            .then(_ => {
                                                io.in(`list:${ listId }`)
                                                    .except(`user:${ request.session.userId }`)
                                                    .emit("itemCountChanged", listId, text);
                                                io.in(`list:${ listId }`).emit("itemCountChangedReload", listId);
                                                response.json(item);
                                            });

                                    },
                                    error => console.log(error)
                                )
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
                                       User.findById(request.session.userId)
                                           .exec()
                                           .then(
                                               user => {
                                                   const authorUsername = user.username;
                                                   const authorProfilePicturePath = user.profilePicturePath;
                                                   const listId = lists[0]._id.toString();
                                                   const text = `${authorUsername} added an assignee to the item "${item.title}"`;
                                                   Notification.create({
                                                       authorUsername,
                                                       authorProfilePicturePath,
                                                       users: lists[0].members
                                                           .filter(m => m.userId !== null
                                                               && m.userId.toString() !== request.session.userId)
                                                           .map(m => m.userId),
                                                       text,
                                                       listId,
                                                       listTitle: lists[0].title
                                                   })
                                                       .catch(error => console.log(error))
                                                       .then(_ => {
                                                           io.in(`list:${ listId }`)
                                                               .except(`user:${ request.session.userId }`)
                                                               .emit("itemAssigneeAdded", listId, text);
                                                           io.in(`list:${ listId }`).emit("itemAssigneeAddedReload", listId);
                                                           response.json(item);
                                                       });

                                               },
                                               error => console.log(error)
                                           )
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
                        User.findById(request.session.userId)
                            .exec()
                            .then(
                                user => {
                                    const authorUsername = user.username;
                                    const authorProfilePicturePath = user.profilePicturePath;
                                    const listId = list._id.toString();
                                    const text = `${authorUsername} removed an assignee from the item "${ item.title }"`;
                                    Notification.create({
                                        authorUsername,
                                        authorProfilePicturePath,
                                        users: list.members
                                            .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                            .map(m => m.userId),
                                        text,
                                        listId,
                                        listTitle: list.title
                                    })
                                        .catch(error => console.log(error))
                                        .then(_ => {
                                            io.in(`list:${ listId }`)
                                                .except(`user:${ request.session.userId }`)
                                                .emit("itemAssigneeRemoved", listId, text);
                                            io.in(`list:${ listId }`).emit("itemAssigneeRemovedReload", listId);
                                            response.json(item);
                                        });

                                },
                                error => console.log(error)
                            )
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
                        User.findById(request.session.userId)
                            .exec()
                            .then(
                                user => {
                                    const authorUsername = user.username;
                                    const authorProfilePicturePath = user.profilePicturePath;
                                    jobs[item._id.toString()]?.cancel();
                                    const listId = list._id.toString();
                                    const text = `${authorUsername} deleted the item "${item.title}"`;
                                    Notification.create({
                                        authorUsername,
                                        authorProfilePicturePath,
                                        users: list.members
                                            .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                            .map(m => m.userId),
                                        text,
                                        listId,
                                        listTitle: list.title
                                    })
                                        .catch(error => console.log(error))
                                        .then(_ => {
                                            io.in(`list:${ listId }`)
                                                .except(`user:${ request.session.userId }`)
                                                .emit("itemDeleted", listId, text);
                                            io.in(`list:${ listId }`).emit("itemDeletedReload", listId);
                                            response.json(item);
                                        });

                                },
                                error => console.log(error)
                            )
                    }
                    return Promise.resolve();
                })
    );
}

function updatePriority(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $set: { priority: !!request.body.priority } },
        (list, item) => {
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = `${authorUsername} changed the priority of the item "${ item.title }"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId,
                            listTitle: list.title
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("itemPriorityChanged", listId, text);
                                io.in(`list:${ listId }`).emit("itemPriorityChangedReload", listId);
                                response.json(item);
                            });

                    },
                    error => console.log(error)
                )
        },
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
