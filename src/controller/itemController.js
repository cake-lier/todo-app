"use strict";

const User = require("../model/userModel.js").createUserModel();
const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const { Error, validateRequest, sendError } = require("../utils/validation");
const mongoose = require("mongoose");
const {scheduleForDate } = require("../utils/schedule");

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
            .then(
                list => {
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
                        .then(async item => {
                            await User.findById(request.session.userId, undefined, {session})
                                .exec()
                                .then(
                                    user => {
                                        const authorUsername = user.username;
                                        const authorProfilePicturePath = user.profilePicturePath;
                                        const listId = list._id.toString();
                                        const text = ` created the new item "${item.title}"`;
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
                                            .catch(error => console.log("B " + error))
                                            .then(_ => {
                                                io.in(`list:${listId}`)
                                                    .except(`user:${request.session.userId}`)
                                                    .emit("itemCreated", listId, `${authorUsername}${text}`);
                                                io.in(`list:${listId}`).emit("itemCreatedReload", listId);
                                                response.json(item);
                                            });
                                    }
                                )
                        });
                })
        ))
        .catch(error => {
            console.log("E" + error);
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
                const list = lists[0];
                return Item.findById(request.params.id, undefined, { session })
                           .exec()
                           .then(item => {
                               if (item === null) {
                                   sendError(response, Error.ResourceNotFound);
                                   return Promise.resolve();
                               }
                               return Promise.all(item.assignees.map(assignee => {
                                   const member = list.members.filter(m => m._id.toString() === assignee.memberId.toString())[0];
                                   if (member.anonymousId !== null) {
                                       return Promise.resolve({
                                           _id: assignee._id,
                                           memberId: assignee.memberId,
                                           username: member.username,
                                           count: assignee.count,
                                           profilePicturePath: null
                                       });
                                   }
                                   return User.findById(member.userId, undefined, { session })
                                              .exec()
                                              .then(user => {
                                                  if (user === null) {
                                                      return Promise.resolve(null);
                                                  }
                                                  return Promise.resolve({
                                                      _id: assignee._id,
                                                      memberId: assignee.memberId,
                                                      username: user.username,
                                                      count: assignee.count,
                                                      profilePicturePath:
                                                          user.profilePicturePath === null
                                                          ? null
                                                          : "/static" + user.profilePicturePath
                                                  });
                                           });
                                   }))
                                   .then(assignees => response.json(assignees.filter(m => m !== null)));
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
                return onSuccess(session, lists[0], session);
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
            .then(async item => {
                if (item === null) {
                    sendError(response, Error.ResourceNotFound);
                } else {
                    await onSuccess(list, item, session);
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
        async (list, item, session) => {
            await User.findById(request.session.userId, undefined, {session})
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` changed the title of the item "${item.title}" to "${request.body.title}"`;
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
                                .emit("itemTitleChanged", listId, `${authorUsername}${text}`);
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

function updateDueDate(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.dueDate
        ? { $set: { dueDate: new Date(request.body.dueDate) } }
        : { $unset: { dueDate: "" } },
        async (list, item, session) => {
            await User.findById(request.session.userId, undefined, {session})
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const dueDate = new Date(request.body.dueDate)
                        const text =
                            request.body.dueDate
                                ? ` set the due date of the item "${item.title}" to ${dueDate.toDateString().substr(3)}`
                                : ` removed the due date from the item "${item.title}"`;
                        const itemId = item._id.toString();
                        jobs[itemId]?.cancel();
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
                                io.in(`list:${listId}`)
                                    .except(`user:${request.session.userId}`)
                                    .emit("itemDueDateChanged", listId, `${authorUsername}${text}`);
                                io.in(`list:${listId}`).emit("itemDueDateChangedReload", listId);
                                response.json(item);
                            });
                    },
                    error => console.log(error)
                )
        }
    );
}

function updateReminderDate(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.reminderDate
        ? { $set: { reminderDate: new Date(request.body.reminderDate) } }
        : { $unset: { reminderDate: "" } },
        async (list, item, session) => {
            await User.findById(request.session.userId, undefined, {session})
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const reminderDate = new Date(request.body.reminderDate);
                        const text = request.body.reminderDate
                            ? ` set the reminder of the item "${item.title}" to ${reminderDate.toDateString().substr(3)} at ${reminderDate.toLocaleTimeString().substr(0,5)}`
                            : ` removed the reminder from the item "${item.title}"`;
                        const itemId = item._id.toString();
                        jobs[itemId]?.cancel();
                        if (request.body.reminderDate) {
                            scheduleForDate(listId, itemId, new Date(request.body.reminderDate));
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
                                io.in(`list:${listId}`)
                                    .except(`user:${request.session.userId}`)
                                    .emit("itemReminderDateChanged", listId, `${authorUsername}${text}`);
                                io.in(`list:${listId}`).emit("itemReminderDateChangedReload", listId);
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
        request.body.isComplete ? { $set: { completionDate: new Date() } } : { $set: { completionDate: "" } },
        async (list, item, session) => {
            await User.findById(request.session.userId, undefined, {session})
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` set the item "${item.title}" as ${request.body.isComplete ? "" : "in"}complete`;
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
                                io.in(`list:${listId}`)
                                    .except(`user:${request.session.userId}`)
                                    .emit("itemCompletionChanged", listId, `${authorUsername}${text}`);
                                io.in(`list:${listId}`).emit("itemCompletionChangedReload", listId);
                                response.json(item);
                            });
                    },
                    error => console.log(error)
                )
        }
    );
}

function addTag(request, response) {
    if (!validateRequest(request, response, ["title", "colorIndex"], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $push: { tags: { title: request.body.title, colorIndex: request.body.colorIndex } } },
        async (list, item, session) => {
            await User.findById(request.session.userId, undefined, {session})
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` added the tag "${request.body.title}" to the item "${item.title}"`;
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
                              .emit("itemTagsAdded", listId, `${authorUsername}${text}`);
                            io.in(`list:${ listId }`).emit("itemTagsAddedReload", listId);
                            response.json(item);
                        });
                    },
                    error => console.log(error)
                )
        }
    );
}

function removeTag(request, response) {
    if (!validateRequest(request, response, [], ["id", "tagId"])) {
        return;
    }
    Item.findById(request.params.id).exec().then(oldItem => {
        updateItemAtomicProperty(
            request,
            response,
            { $pull: { tags: { _id: mongoose.Types.ObjectId(request.params.tagId) } } },
            async (list, item, session) => {
                await User.findById(request.session.userId, undefined, { session })
                    .exec()
                    .then(
                        user => {
                            const authorUsername = user.username;
                            const authorProfilePicturePath = user.profilePicturePath;
                            const listId = list._id.toString();
                            const text = `
                             removed the tag "${oldItem.tags.find(i => i._id.toString() === request.params.tagId).title}"
                             from the item "${item.title}"`;
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
                                        .emit("itemTagsRemoved", listId, `${authorUsername}${text}`);
                                    io.in(`list:${ listId }`).emit("itemTagsRemovedReload", listId);
                                    response.json(item);
                                });
                        },
                        error => console.log(error)
                    )
            }
        );
    })
}

function updateCount(request, response) {
    if (!validateRequest(request, response, ["count"], ["id"])) {
        return;
    }
    updateItemProperty(
        request,
        response,
        async (session, list) =>
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
                    .then(async item => {
                        if (item === null) {
                            sendError(response, Error.ResourceNotFound);
                        } else {
                            await User.findById(request.session.userId)
                                .exec()
                                .then(
                                    user => {
                                        const authorUsername = user.username;
                                        const authorProfilePicturePath = user.profilePicturePath;
                                        const listId = list._id.toString();
                                        const text = ` changed the count of the item "${item.title}"`;
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
                                                io.in(`list:${listId}`)
                                                    .except(`user:${request.session.userId}`)
                                                    .emit("itemCountChanged", listId, `${authorUsername}${text}`);
                                                io.in(`list:${listId}`).emit("itemCountChangedReload", listId);
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
    if (!validateRequest(request, response, ["memberId", "count"], ["id"])) {
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
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(request.params.id),
                            assignees: { $not: { $elemMatch: { memberId: mongoose.Types.ObjectId(request.body.memberId) } } }
                        }
                    },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: { $arrayElemAt: [ "$lists", 0 ] } } },
                    {
                        $match: {
                            $and: [
                                {
                                    members: {
                                        $elemMatch:
                                        userId !== undefined
                                        ? { userId: mongoose.Types.ObjectId(userId) }
                                        : { anonymousId: request.body.anonymousId }
                                    },
                                },
                                { members: { $elemMatch: { _id: mongoose.Types.ObjectId(request.body.memberId) } } }
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
                            if (item === null) {
                                sendError(response, Error.ResourceNotFound);
                                return Promise.resolve();
                            }
                            if (item.remainingCount < request.body.count) {
                                sendError(response, Error.GeneralError);
                                return Promise.resolve();
                            }
                            return Item.findByIdAndUpdate(
                                    request.params.id,
                                    {
                                        remainingCount: item.remainingCount - request.body.count,
                                        $push: { assignees: { memberId: request.body.memberId, count: request.body.count } }
                                    },
                                    { session, runValidators: true, new: true, context: "query" }
                                )
                               .exec()
                               .then(async item => {
                                   if (item === null) {
                                       sendError(response, Error.ResourceNotFound);
                                   } else {
                                       await User.findById(request.session.userId, undefined, {session})
                                           .exec()
                                           .then(
                                               async user => {
                                                   const authorUsername = user.username;
                                                   const authorProfilePicturePath = user.profilePicturePath;
                                                   const assigneeUserId = lists[0].members.find(m => m._id.toString() === request.body.memberId).userId.toString()
                                                   const listId = lists[0]._id.toString();
                                                   let text;
                                                   if (user._id.toString() === assigneeUserId) {
                                                       text = ` added themselves to the item "${item.title}"`;
                                                   } else {
                                                       await
                                                           User.findById(assigneeUserId, undefined, { session })
                                                           .exec()
                                                           .then(user => {
                                                               text = ` added the member ${user.username} to the item "${item.title}"`
                                                           })
                                                   }
                                                   Notification.create({
                                                       authorUsername,
                                                       authorProfilePicturePath,
                                                       users: lists[0].members
                                                           .filter(
                                                               m => m.userId !== null
                                                                   && m.userId.toString() !== request.session.userId
                                                                   && m._id.toString() !== request.body.memberId
                                                           )
                                                           .map(m => m.userId),
                                                       text,
                                                       listId,
                                                       listTitle: lists[0].title
                                                   })
                                                       .catch(error => console.log(error))
                                                       .then(_ => {
                                                               io.in(`list:${listId}`)
                                                                   .except(`user:${request.session.userId}`)
                                                                   .except(`user:${assigneeUserId}`)
                                                                   .emit("itemAssigneeAdded", listId, `${authorUsername}${text}`);
                                                               io.in(`list:${listId}`).emit("itemAssigneeAddedReload", listId)})
                                                       .then(_ => {
                                                           let userText = ` added you to the item "${item.title}"`;
                                                           Notification.create({
                                                               authorUsername,
                                                               authorProfilePicturePath,
                                                               users: lists[0].members
                                                                   .filter(
                                                                       m => m.userId !== null
                                                                           && m._id.toString() === request.body.memberId
                                                                   )
                                                                   .map(m => m.userId),
                                                               text: userText,
                                                               listId,
                                                               listTitle: lists[0].title
                                                           })
                                                               .catch(error => console.log(error))
                                                               .then(_ => {
                                                                   io.in(`user:${assigneeUserId}`)
                                                                       .except(`user:${request.session.userId}`)
                                                                       .emit("itemAssigneeAdded", listId, `${authorUsername}${userText}`);
                                                                   io.in(`list:${listId}`).emit("itemAssigneeAddedReload", listId);
                                                                   response.json(item);
                                                               });
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

function updateAssignee(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["count"], ["id", "assigneeId"])) {
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
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(request.params.id),
                            assignees: { $elemMatch: { _id: mongoose.Types.ObjectId(request.params.assigneeId) } }
                        }
                    },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: { $arrayElemAt: [ "$lists", 0 ] } } },
                    {
                        $match: {
                            members: {
                                $elemMatch:
                                    userId !== undefined
                                    ? { userId: mongoose.Types.ObjectId(userId) }
                                    : { anonymousId: request.body.anonymousId }
                            },
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
                               if (item === null) {
                                   sendError(response, Error.ResourceNotFound);
                                   return Promise.resolve();
                               }
                               const removedCount =
                                   request.body.count
                                   - (item.assignees.filter(a => a._id.toString() === request.params.assigneeId)[0].count);
                               if (item.remainingCount < removedCount) {
                                   sendError(response, Error.GeneralError);
                                   return Promise.resolve();
                               }
                               return Item.findByIdAndUpdate(
                                   request.params.id,
                                   {
                                       $set: {
                                           remainingCount: item.remainingCount - removedCount,
                                           "assignees.$[element].count": request.body.count
                                       }
                                   },
                                   {
                                       session,
                                       runValidators: true,
                                       new: true,
                                       context: "query",
                                       arrayFilters: [ { "element._id": mongoose.Types.ObjectId(request.params.assigneeId) } ]
                                   }
                               )
                               .exec()
                               .then(async item => {
                                   const assigneeUserId =
                                       lists[0].members.find(m => m._id.toString() === item.assignees.find(a => a._id.toString() === request.params.assigneeId).memberId.toString()).userId.toString();
                                   if (item === null) {
                                       sendError(response, Error.ResourceNotFound);
                                   } else {
                                       await User.findById(request.session.userId)
                                           .exec()
                                           .then(
                                               async user => {
                                                   const authorUsername = user.username;
                                                   const authorProfilePicturePath = user.profilePicturePath;
                                                   const listId = lists[0]._id.toString();
                                                   let text;

                                                   if (user._id.toString() === assigneeUserId) {
                                                       text = ` updated their assigned count in the item "${item.title}"`;
                                                   } else {
                                                       await User.findById(assigneeUserId, undefined, {session})
                                                           .exec()
                                                           .then(user => {
                                                               text = ` updated the assigned count of the member ${user.username} in the item "${item.title}"`
                                                           })
                                                   }
                                                   Notification.create({
                                                       authorUsername,
                                                       authorProfilePicturePath,
                                                       users:
                                                           lists[0].members
                                                               .filter(
                                                                   m => m.userId !== null
                                                                       && m.userId.toString() !== request.session.userId
                                                                       && m.userId.toString() !== assigneeUserId
                                                               )
                                                               .map(m => m.userId),
                                                       text,
                                                       listId,
                                                       listTitle: lists[0].title
                                                   })
                                                       .catch(error => console.log(error))
                                                       .then(_ => {
                                                           io.in(`list:${listId}`)
                                                               .except(`user:${request.session.userId}`)
                                                               .except(`user:${assigneeUserId}`)
                                                               .emit("itemAssigneeAdded", listId, `${authorUsername}${text}`);
                                                           io.in(`list:${listId}`).emit("itemAssigneeAddedReload", listId)})
                                                       .then(_ => {
                                                           const userText = ` updated your assigned count in the item "${item.title}"`;
                                                           Notification.create({
                                                               authorUsername,
                                                               authorProfilePicturePath,
                                                               users:
                                                                   lists[0].members
                                                                       .filter(
                                                                           m => m.userId !== null
                                                                               && m.userId.toString() === assigneeUserId
                                                                       )
                                                                       .map(m => m.userId),
                                                               text: userText,
                                                               listId,
                                                               listTitle: lists[0].title
                                                           })
                                                               .catch(error => console.log(error))
                                                               .then(_ => {
                                                                   io.in(`user:${assigneeUserId}`)
                                                                       .except(`user:${request.session.userId}`)
                                                                       .emit("itemAssigneeUpdated", listId, `${authorUsername}${userText}`);
                                                                   io.in(`list:${listId}`).emit("itemAssigneeUpdatedReload", listId);
                                                                   response.json(item);
                                                               });
                                                       });
                                               },
                                               error => console.log(error)
                                           );
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
                const assigneeUserId = list.members
                    .find(m => m._id.toString() === (item.assignees.find(a => a._id.toString() === assigneeId)).memberId.toString()).userId.toString();
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
                .then(async item => {
                    if (item === null) {
                        sendError(response, Error.ResourceNotFound);
                    } else {
                        await User.findById(request.session.userId, undefined, {session})
                            .exec()
                            .then(
                                async user => {
                                    const authorUsername = user.username;
                                    const authorProfilePicturePath = user.profilePicturePath;
                                    const listId = list._id.toString();
                                    let text;
                                    if (user._id.toString() === assigneeUserId) {
                                        text = ` removed themselves from the item "${item.title}"`;
                                    } else {
                                        await User.findById(assigneeUserId, undefined, {session})
                                            .exec()
                                            .then(user => {
                                                text = ` removed the member ${user.username} from the item "${item.title}"`;
                                            })
                                    }
                                    Notification.create({
                                        authorUsername,
                                        authorProfilePicturePath,
                                        users: list.members
                                            .filter(m => m.userId !== null
                                                    && m.userId.toString() !== request.session.userId
                                                    && m.userId.toString() !== assigneeUserId
                                            )
                                            .map(m => m.userId),
                                        text,
                                        listId,
                                        listTitle: list.title
                                    })
                                        .catch(error => console.log(error))
                                        .then(_ => {
                                            io.in(`list:${listId}`)
                                                .except(`user:${request.session.userId}`)
                                                .except(`user:${assigneeUserId}`)
                                                .emit("itemAssigneeAdded", listId, `${authorUsername}${text}`);
                                            io.in(`list:${listId}`).emit("itemAssigneeAddedReload", listId)})
                                        .then(_ => {
                                            const userText = ` removed you from the item "${item.title}"`;
                                            Notification.create({
                                                authorUsername,
                                                authorProfilePicturePath,
                                                users: list.members
                                                    .filter(m => m.userId !== null
                                                        && m.userId.toString() === assigneeUserId
                                                    )
                                                    .map(m => m.userId),
                                                text: userText,
                                                listId,
                                                listTitle: list.title
                                            })
                                                .catch(error => console.log(error))
                                                .then(_ => {
                                                    io.in(`user:${assigneeUserId}`)
                                                        .except(`user:${request.session.userId}`)
                                                        .emit("itemAssigneeRemoved", listId, `${authorUsername}${userText}`);
                                                    io.in(`list:${listId}`).emit("itemAssigneeRemovedReload", listId);
                                                    response.json(item);
                                                });
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
                .then(async item => {
                    if (item === null) {
                        sendError(response, Error.ResourceNotFound);
                    } else {
                        await User.findById(request.session.userId, undefined, { session })
                            .exec()
                            .then(
                                user => {
                                    const authorUsername = user.username;
                                    const authorProfilePicturePath = user.profilePicturePath;
                                    jobs[item._id.toString()]?.cancel();
                                    const listId = list._id.toString();
                                    const text = ` deleted the item "${item.title}"`;
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
                                                .emit("itemDeleted", listId, `${authorUsername}${text}`);
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
        (list, item, session) => {
            User.findById(request.session.userId, undefined, { session })
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` changed the priority of the item "${ item.title }"`;
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
                                  .emit("itemPriorityChanged", listId, `${authorUsername}${text}`);
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
    updateDueDate,
    updateReminderDate,
    updateCompletion,
    addTag,
    removeTag,
    updateCount,
    addAssignee,
    updateAssignee,
    removeAssignee,
    getAssignees,
    updatePriority,
    deleteItem
}
