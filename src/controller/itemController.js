"use strict";

const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const validation = require("../utils/validation");
const mongoose = require("mongoose");

function createItem(request, response) {
    if (!validation.validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    const userId = request.session.userId;
    if (userId === undefined && !request.body.anonymousId) {
        validation.sendError(response, validation.Error.RequestError);
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
                    validation.sendError(response, validation.Error.RequestError);
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
                .then(item => response.json(item));
            })
        ))
        .catch(error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        });
}

function getUserItems(request, response) {
    if (!validation.validateRequest(request, response, [], [], true)) {
        return;
    }
    List.aggregate([
        { $match: { members: { $elemMatch: { userId: request.session.userId } } } },
        { $lookup: { from: "items", localField: "_id", foreignField: "listId", as: "items" } },
        { $unwind: "$items" },
        { $replaceRoot: { newRoot: "$items" } }
    ])
    .exec()
    .then(
        items => response.json(items),
        error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        }
    );
}

function getListItems(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
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
            validation.sendError(response, validation.Error.GeneralError);
        }
    );
}

function updateItemProperty(request, response, updater) {
    const userId = request.session.userId;
    if (userId === undefined && !request.body.anonymousId) {
        validation.sendError(response, validation.Error.RequestError);
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
                                $elemMatch: userId !== undefined ? { userId } : { anonymousId: request.body.anonymousId }
                            }
                        }
                    }
                ],
                { session }
            )
            .exec()
            .then(list => {
                if (list === []) {
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return updater(session).then(item => {
                    if (item === null) {
                        validation.sendError(response, validation.Error.ResourceNotFound);
                    } else {
                        response.json(item);
                    }
                    return Promise.resolve();
                });
            })
        ))
        .catch(error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        });
}

function updateItemAtomicProperty(request, response, updateObject) {
    updateItemProperty(
        request,
        response,
        session =>
            Item.findByIdAndUpdate(
                request.params.id,
                updateObject,
                { runValidators: true, new: true, context: "query", session }
            )
            .exec()
    );
}

function updateTitle(request, response) {
    if (!validation.validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    updateItemAtomicProperty(request, response, { $set: { title: request.body.title } });
}

function updateText(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.text ? { $set: { text: request.body.text } } : { $unset: { text: "" } }
    );
}

function updateDueDate(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.dueDate ? { $set: { dueDate: request.body.dueDate } } : { $unset: { dueDate: "" } }
    );
}

function updateReminderDate(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.reminderDate
        ? { $set: { reminderDate: request.body.reminderDate } }
        : { $unset: { reminderDate: "" } }
    );
}

function updateCompletion(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        request.body.isComplete ? { $set: { completionDate: Date.now() } } : { $unset: { completionDate: "" } }
    );
}

function addTags(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $addToSet: { tags: { $each: request.body.tags ? request.body.tags : [] } } }
    );
}

function removeTags(request, response) {
    if (!validation.validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateItemAtomicProperty(
        request,
        response,
        { $pullAll: { tags: request.body.tags ? request.body.tags : [] } }
    );
}

function updateCount(request, response) {
    if (!validation.validateRequest(request, response, ["count"], ["id"])) {
        return;
    }
    updateItemProperty(
        request,
        response,
        session =>
            Item.findById(request.params.id, undefined, { session })
                .exec()
                .then(item => {
                    if (item === null || item.count - request.body.count > item.remainingCount) {
                        return Promise.resolve(null);
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
                    .exec();
                })
    );
}

function addAssignee(request, response) {
    const userId = request.session.userId;
    if (!validation.validateRequest(request, response, ["userId", "isAnonymous", "count"], ["id"])) {
        return;
    }
    if (userId === undefined && !request.body.anonymousId) {
        validation.sendError(response, validation.Error.RequestError);
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
            .then(list => {
                if (list === []) {
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return Item.findById(request.params.id, undefined, { session })
                           .exec()
                           .then(item => {
                               if (item === null || item.remainingCount < request.body.count) {
                                   validation.sendError(response, validation.Error.ResourceNotFound);
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
                                       validation.sendError(response, validation.Error.ResourceNotFound);
                                   } else {
                                       response.json(item);
                                   }
                                   return Promise.resolve();
                               });
                           });
            })
        ))
        .catch(error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        });
}

function removeAssignee(request, response) {
    if (!validation.validateRequest(request, response, [], ["id", "assigneeId"])) {
        return;
    }
    const assigneeId = request.params.assigneeId;
    updateItemProperty(
        request,
        response,
        session =>
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
                .exec();
            })
    );
}

module.exports = {
    createItem,
    getUserItems,
    getListItems,
    updateTitle,
    updateText,
    updateDueDate,
    updateReminderDate,
    updateCompletion,
    addTags,
    removeTags,
    updateCount,
    addAssignee,
    removeAssignee
}
