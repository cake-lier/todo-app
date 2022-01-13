const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel.js").createItemModel();

function createItem(request, response) {
    Item.create({
        listId: request.body.listId,
        title: request.body.title,
        text: request.body.text,
        dueDate: request.body.dueDate,
        reminderDate: request.body.reminderDate,
        completionDate: request.body.completionDate,
        tags: request.body.tags,
        count: request.body.count
    })
    .then(item => response.json(item), error => response.status(500).send(error));
}

function getUserItems(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    List.aggregate([
        { $match: { members: { $elemMatch: { userId } } } },
        { $lookup: { from: "items", localField: "_id", foreignField: "listId", as: "items" } },
        { $unwind: "$items" },
        { $replaceRoot: { newRoot: "$items" } }
    ])
    .exec()
    .then(items => response.json(items), error => response.status(500).send(error));
}

function getListItems(request, response) {
    const userId = request.session.userId;
    List.aggregate([
        {
            $match: {
                _id: request.params.id,
                members: { $elemMatch: { $or: [ { userId }, { anonymousId: request.body.userId } ] } }
            }
        },
        { $lookup: { from: "items", localField: "_id", foreignField: "listId", as: "items" } },
        { $unwind: "$items" },
        { $replaceRoot: { newRoot: "$items" } }
    ])
    .exec()
    .then(items => response.json(items), error => response.status(500).send(error));
}

function updateItemProperty(request, response, updater) {
    const userId = request.session.userId;
    List.startSession()
        .then(session => session.withTransaction(() =>
            Item.aggregate(
                [
                    { $match: { _id: request.params.id } },
                    { $lookup: { from: "lists", localField: "listId", foreignField: "_id", as: "lists" } },
                    { $replaceRoot: { newRoot: "$lists" } },
                    { $match: { members: { $elemMatch: { $or: [ { userId }, { anonymousId: request.body.userId } ] } } } }
                ],
                { session })
                .exec()
                .then(list => {
                    if (list === []) {
                        return Promise.reject("An error has occurred while updating the item title");
                    }
                    return updater(session);
                })
        ))
        .then(
            item => {
                if (item === null) {
                    response.sendStatus(404);
                    return;
                }
                response.json(item);
            },
            error => response.status(500).send(error)
        );
}

function updateItemAtomicProperty(request, response, updateObject) {
    updateItemProperty(
        request,
        response,
        session =>
            Item.findByIdAndUpdate(request.params.id, updateObject, { runValidators: true, new: true, session }).exec()
    );
}

function updateTitle(request, response) {
    updateItemAtomicProperty(request, response, { $set: { title: request.body.title } });
}

function updateText(request, response) {
    updateItemAtomicProperty(request, response, { $set: { text: request.body.text } });
}

function updateDueDate(request, response) {
    updateItemAtomicProperty(request, response, { $set: { dueDate: request.body.dueDate } });
}

function updateReminderDate(request, response) {
    updateItemAtomicProperty(request, response, { $set: { reminderDate: request.body.reminderDate } });
}

function updateCompletionDate(request, response) {
    updateItemAtomicProperty(request, response, { $set: { completionDate: request.body.completionDate } });
}

function addTags(request, response) {
    updateItemAtomicProperty(request, response, { $addToSet: { tags: { $each: request.body.tags } } });
}

function removeTags(request, response) {
    updateItemAtomicProperty(request, response, { $pullAll: { tags: request.body.tags } });
}

function updateCount(request, response) {
    updateItemProperty(
        request,
        response,
        session =>
            Item.findById(request.params.id, { session })
                .exec()
                .then(result => {
                    if (result === null || result.count - request.body.count > result.remainingCount) {
                        return Promise.reject(new Error("An error has occurred while updating the count value"));
                    }
                    return Item.findByIdAndUpdate(
                        request.params.id,
                        {
                            $set: {
                                count: request.body.count,
                                remainingCount: result.remainingCount - (result.count - request.body.count)
                            }
                        },
                        { runValidators: true, new: true, session }
                    )
                    .exec();
                })
    );
}

function createAssigneeObject(request, itemObject) {
    return {
        count: request.body.count,
        remainingCount: itemObject.remainingCount - request.body.count
    };
}

function addAssignee(request, response) {
    updateItemProperty(
        request,
        response,
        session =>
            Item.findById(request.params.id, { session })
                .exec()
                .then(result => {
                    if (result === null || result.remainingCount < request.body.count) {
                        return Promise.reject(new Error("An error has occurred while updating the count value"));
                    }
                    return Item.findByIdAndUpdate(
                        request.params.id,
                        {
                            $push: {
                                assignees:
                                    request.body.isAnonymous
                                    ? Object.assign(
                                        { anonymousId: request.body.anonymousId },
                                        createAssigneeObject(request, result)
                                      )
                                    : Object.assign(
                                        { userId: request.body.userId },
                                        createAssigneeObject(request, result)
                                      )
                            }
                        },
                        { session, runValidators: true, new: true }
                    )
                    .exec();
                })
    );
}

function removeAssignee(request, response) {
    updateItemProperty(
        request,
        response,
        session =>
            Item.findByIdAndUpdate(
                request.params.id,
                { $pull: { assignees: request.params.assigneeId } },
                { session, runValidators: true, new: true }
            )
            .exec()
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
    updateCompletionDate,
    addTags,
    removeTags,
    updateCount,
    addAssignee,
    removeAssignee
}
