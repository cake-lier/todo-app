"use strict";

const List = require("../model/listModel").createListModel();
const User = require("../model/userModel.js").createUserModel();
const uuid = require("uuid");
const otp = require("otp-generator");
const { Error, validateRequest, sendError } = require("../utils/validation");
const { notifyRoomExceptSender } = require("./sockets");

function createList(request, response) {
    if (!validateRequest(request, response, ["title"], [], true)) {
        return;
    }
    List.create({
        title: request.body.title,
        joinCode: request.body.isVisible ? uuid.v4() : null,
        colorIndex: request.body.colorIndex,
        members: [{
            userId: request.session.userId,
            role: "owner"
        }]
    })
    .then(
        list => {
            sockets[request.session.userId].forEach(s => s.join(`list:${ l._id.toString() }`));
            response.json(list);
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function deleteList(request, response) {
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    List.findOneAndDelete(
        { _id: request.params.id, members: { $elemMatch: { userId: request.session.userId, role: "owner" } } }
    )
    .exec()
    .then(
        result => {
            if (result.deletedCount === 0) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            sockets[request.session.userId].forEach(s => s.leave(`list:${ l._id.toString() }`));
            response.send();
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getList(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    if (request.session.userId === undefined && request.body.anonymousId === undefined) {
        sendError(response, Error.RequestError);
        return;
    }
    List.findOne({
        _id: request.params.id,
        members: {
            $elemMatch:
                request.session.userId !== undefined
                ? { userId: request.session.userId }
                : { anonymousId: request.body.anonymousId }
        }
    })
    .exec()
    .then(
        list => {
            if (list === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            response.json(list);
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getUserLists(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    List.find({ members: { $elemMatch: { userId: request.session.userId } } })
        .exec()
        .then(
            lists => response.json(lists),
            error => {
                console.log(error);
                sendError(response, Error.GeneralError);
            }
        );
}

function updateListProperty(request, response, filterObject, updateObject, optionsObject = {}) {
    List.findOneAndUpdate(
        filterObject,
        updateObject,
        Object.assign({ runValidators: true, new: true, context: "query" }, optionsObject)
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            notifyRoomExceptSender(
                `list:${ list._id.toString() }`,
                request.session.userId,
                "listUpdate",
                list._id.toString()
            );
            response.json(list);
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function updateUnprivilegedListProperty(request, response, updateObject) {
    if (request.session.userId === undefined && request.body.anonymousId === undefined) {
        sendError(response, Error.RequestError);
        return;
    }
    updateListProperty(
        request,
        response,
        {
            _id: request.params.id,
            members: {
                $elemMatch:
                    request.session.userId !== undefined
                        ? { userId: request.session.userId }
                        : { anonymousId: request.body.anonymousId }
            }
        },
        updateObject
    );
}

function updateTitle(request, response) {
    if (!validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    updateUnprivilegedListProperty(request, response, { $set: { title: request.body.title } });
}

function updateVisibility(request, response) {
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    updateListProperty(
        request,
        response,
        { _id: request.params.id, members: { $elemMatch: { userId: request.session.userId, role: "owner" } } },
        request.body.isVisible ? { $set: { joinCode: otp.generate(6) } } : { $unset: { joinCode: "" } },
    );
}

function updateColorIndex(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateUnprivilegedListProperty(
        request,
        response,
        request.body.colorIndex ? { $set: { colorIndex: request.body.colorIndex } } : { $unset: { colorIndex: "" } }
    );
}

function addMember(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    if (request.body.userId === undefined && request.body.anonymousId === undefined) {
        sendError(response, Error.RequestError);
        return;
    }
    if (request.body.userId !== undefined) {
        User.startSession()
            .then(session => session.withTransaction(() =>
                User.findById(request.body.userId, undefined,  { session })
                    .exec()
                    .then(user => {
                        if (user === null) {
                            sendError(response, Error.RequestError);
                            return;
                        }
                        updateListProperty(
                            request,
                            response,
                            {
                                _id: request.params.id,
                                members: {
                                    $elemMatch: { userId, role: "owner" },
                                    $not: { $elemMatch: { userId: request.body.userId } }
                                }
                            },
                            { $push: { members: { userId: request.body.userId } } },
                            { session }
                        );
                    })
            ));
        return;
    }
    updateListProperty(
        request,
        response,
        {
            _id: request.params.id,
            joinCode: { $ne: null },
            members: {
                $elemMatch: { userId, role: "owner" },
                $not: { $elemMatch: { anonymousId: request.body.anonymousId } }
            }
        },
        { $push: { members: { anonymousId: request.body.anonymousId } } }
    );
}

function removeMember(request, response) {
    if (!validateRequest(request, response, [], ["id", "memberId"], true)) {
        return;
    }
    updateListProperty(
        request,
        response,
        {
            _id: request.params.id,
            $or: [
                {
                    members: {
                        $elemMatch: {
                            _id: request.params.memberId,
                            userId: request.session.userId,
                            role: { $ne: "owner" }
                        }
                    }
                },
                {
                    members: {
                        $elemMatch: {
                            _id: { $ne: request.params.memberId },
                            userId: request.session.userId,
                            role: "owner"
                        }
                    }
                }
            ]
        },
        { $pull: { members: { _id: request.params.memberId } } },
    );
}

module.exports = {
    createList,
    deleteList,
    getList,
    getUserLists,
    updateTitle,
    updateVisibility,
    updateColorIndex,
    addMember,
    removeMember
}
