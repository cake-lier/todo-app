"use strict";

const User = require("../model/userModel.js").createUserModel();
const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const { Error, validateRequest, sendError } = require("../utils/validation");
const mongoose = require("mongoose");
const {scheduleForDate } = require("../utils/schedule");

function createItem(request, response) {
    if (!validateRequest(request, response, ["title", "count"], ["id"])) {
        return;
    }
    const userId = request.session.userId;
    if (userId === undefined && request.query.anonymousId === undefined) {
        sendError(response, Error.RequestError);
        return;
    }
    List.startSession()
        .then(session => session.withTransaction(() =>
            List.findOne(
                {
                    _id: request.params.id,
                    members: { $elemMatch: userId !== undefined ? { userId } : { anonymousId: request.query.anonymousId } }
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
                    reminderDate: request.body.reminderDate,
                    tags: request.body.tags,
                    count: request.body.count,
                    remainingCount: request.body.count
                })
                .then(item => {
                    (
                        request.session.userId
                        ? User.findById(request.session.userId).exec()
                        : Promise.resolve({
                              username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                              profilePicturePath: null
                          })
                    )
                    .then(user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` created the new item "${ item.title }"`;
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
                              .emit("itemCreated", listId, text);
                            io.in(`list:${ listId }`).emit("itemCreatedReload", listId);
                            response.json(item);
                        });
                    })
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
                        : { anonymousId: request.query.anonymousId }
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
    if (userId === undefined && request.query.anonymousId === undefined) {
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
                                    : { anonymousId: request.query.anonymousId }
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
    if (userId === undefined && request.query.anonymousId === undefined) {
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
                                    : { anonymousId: request.query.anonymousId }
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
            .then(item => {
                if (item === null) {
                    sendError(response, Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return onSuccess(list, item, session);
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
        (list, item, session) => {
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
                const authorUsername = user.username;
                const authorProfilePicturePath = user.profilePicturePath;
                const listId = list._id.toString();
                const text = ` changed the title of the item "${ item.title }" to "${ request.body.title }"`;
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
            })
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
        (list, item, session) => {
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
                const authorUsername = user.username;
                const authorProfilePicturePath = user.profilePicturePath;
                const listId = list._id.toString();
                const text =
                    request.body.dueDate
                    ? ` set a due date to the item "${ item.title }"`
                    : ` removed a due date from the item "${ item.title }"`;
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
                    io.in(`list:${ listId }`)
                      .except(`user:${ request.session.userId }`)
                      .emit("itemDueDateChanged", listId, text);
                    io.in(`list:${ listId }`).emit("itemDueDateChangedReload", listId);
                    response.json(item);
                });
            })
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
        (list, item, session) => {
            (
                request.session.userId
                    ? User.findById(request.session.userId, undefined, { session }).exec()
                    : Promise.resolve({
                        username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                        profilePicturePath: null
                    })
            )
            .then(user => {
                const authorUsername = user.username;
                const authorProfilePicturePath = user.profilePicturePath;
                const listId = list._id.toString();
                const text = request.body.reminderDate
                             ? ` set a reminder set to the item "${ item.title }"`
                             : ` removed a reminder from the item "${ item.title }"`;
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
                    io.in(`list:${ listId }`)
                      .except(`user:${ request.session.userId }`)
                      .emit("itemReminderDateChanged", listId, text);
                    io.in(`list:${ listId }`).emit("itemReminderDateChangedReload", listId);
                    response.json(item);
                });
            })
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
        (list, item, session) => {
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
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
                      .except(`user:${ request.session.userId }`)
                      .emit("itemCompletionChanged", listId, text);
                    io.in(`list:${listId}`).emit("itemCompletionChangedReload", listId);
                    response.json(item);
                });
            })
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
        (list, item, session) => {
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
                const authorUsername = user.username;
                const authorProfilePicturePath = user.profilePicturePath;
                const listId = list._id.toString();
                const text = ` added some tags to the item "${item.title}"`;
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
                      .emit("itemTagsAdded", listId, text);
                    io.in(`list:${ listId }`).emit("itemTagsAddedReload", listId);
                    response.json(item);
                });
            })
        }
    );
}

function removeTag(request, response) {
    if (!validateRequest(request, response, [], ["id", "tagId"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $pull: { tags: { _id: mongoose.Types.ObjectId(request.params.tagId) } } },
        (list, item, session) => {
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
                const authorUsername = user.username;
                const authorProfilePicturePath = user.profilePicturePath;
                const listId = list._id.toString();
                const text = ` removed some tags from the item "${item.title}"`;
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
                      .emit("itemTagsRemoved", listId, text);
                    io.in(`list:${ listId }`).emit("itemTagsRemovedReload", listId);
                    response.json(item);
                });
            })
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
                            return Promise.resolve();
                        }
                         return (
                             request.session.userId
                             ? User.findById(request.session.userId, undefined, { session }).exec()
                             : Promise.resolve({
                                   username: list.members
                                                 .filter(m => m.anonymousId === request.query.anonymousId)[0]
                                                 .username,
                                   profilePicturePath: null
                               })
                         )
                         .then(user => {
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
                                 io.in(`list:${ listId }`)
                                   .except(`user:${ request.session.userId }`)
                                   .emit("itemCountChanged", listId, text);
                                 io.in(`list:${ listId }`).emit("itemCountChangedReload", listId);
                                 response.json(item);
                             });
                         });
                    });
                })
    );
}

function addAssignee(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["memberId", "count"], ["id"])) {
        return;
    }
    if (userId === undefined && request.query.anonymousId === undefined) {
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
                                        : { anonymousId: request.query.anonymousId }
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
                               .then(item => {
                                   if (item === null) {
                                       sendError(response, Error.ResourceNotFound);
                                       return Promise.resolve();
                                   }
                                   return (
                                       request.session.userId
                                       ? User.findById(request.session.userId, undefined, { session }).exec()
                                       : Promise.resolve({
                                             username: lists[0].members
                                                               .filter(m => m.anonymousId === request.query.anonymousId)[0]
                                                               .username,
                                             profilePicturePath: null
                                         })
                                   )
                                   .then(user => {
                                       const authorUsername = user.username;
                                       const authorProfilePicturePath = user.profilePicturePath;
                                       const listId = lists[0]._id.toString();
                                       const text = ` added an assignee to the item "${item.title}"`;
                                       Notification.create({
                                           authorUsername,
                                           authorProfilePicturePath,
                                           users: lists[0].members
                                                          .filter(
                                                              m => m.userId !== null
                                                                   && m.userId.toString() !== request.session.userId
                                                          )
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
                                   });
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
    if (userId === undefined && request.query.anonymousId === undefined) {
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
                                    : { anonymousId: request.query.anonymousId }
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
                               .then(item => {
                                   if (item === null) {
                                       sendError(response, Error.ResourceNotFound);
                                       return Promise.resolve();
                                   }
                                   return (
                                       request.session.userId
                                       ? User.findById(request.session.userId, undefined, { session }).exec()
                                       : Promise.resolve({
                                             username: lists[0].members
                                                               .filter(m => m.anonymousId === request.query.anonymousId)[0]
                                                               .username,
                                             profilePicturePath: null
                                         })
                                   )
                                   .then(user => {
                                       const authorUsername = user.username;
                                       const authorProfilePicturePath = user.profilePicturePath;
                                       const listId = lists[0]._id.toString();
                                       const text = `${authorUsername} updated an assignee of the item "${item.title}"`;
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
                                             .emit("itemAssigneeUpdated", listId, text);
                                           io.in(`list:${ listId }`).emit("itemAssigneeUpdatedReload", listId);
                                           response.json(item);
                                       });
                                   });
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
                        return Promise.resolve();
                    }
                    return (
                        request.session.userId
                        ? User.findById(request.session.userId, undefined, { session }).exec()
                        : Promise.resolve({
                              username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                              profilePicturePath: null
                          })
                    )
                    .then(user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` removed an assignee from the item "${ item.title }"`;
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
                    });
                });
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
                        return Promise.resolve();
                    }
                    return (
                        request.session.userId
                            ? User.findById(request.session.userId, undefined, { session }).exec()
                            : Promise.resolve({
                                username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                                profilePicturePath: null
                            })
                    )
                    .then(user => {
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
                              .emit("itemDeleted", listId, text);
                            io.in(`list:${ listId }`).emit("itemDeletedReload", listId);
                            response.json(item);
                        });
                    });
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
            (
                request.session.userId
                ? User.findById(request.session.userId, undefined, { session }).exec()
                : Promise.resolve({
                      username: list.members.filter(m => m.anonymousId === request.query.anonymousId)[0].username,
                      profilePicturePath: null
                  })
            )
            .then(user => {
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
                      .emit("itemPriorityChanged", listId, text);
                    io.in(`list:${ listId }`).emit("itemPriorityChangedReload", listId);
                    response.json(item);
                });
            })
        }
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
