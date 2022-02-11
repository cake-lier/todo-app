"use strict";

const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const User = require("../model/userModel.js").createUserModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const uuid = require("uuid");
const otp = require("otp-generator");
const { Error, validateRequest, sendError } = require("../utils/validation");
const mongoose = require("mongoose");

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
            const listId = list._id.toString();
            io.in(`user:${ request.session.userId }`).socketsJoin(`list:${ listId }`);
            io.in(`user:${ request.session.userId }`).socketsJoin(`list:${ listId }:owner`);
            io.in(`list:${ listId }`).emit("listCreatedReload", listId);
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
    List.startSession()
        .then(session => session.withTransaction(() =>
            List.findOneAndDelete(
                { _id: request.params.id, members: { $elemMatch: { userId: request.session.userId, role: "owner" } } },
                { session }
            )
            .exec()
            .then(list => {
                if (list === null) {
                    sendError(response, Error.ResourceNotFound);
                    return Promise.resolve();
                }
                return Item.deleteMany({ listId: list._id }, { session })
                           .exec()
                           .then(_ => {
                               User.findById(request.session.userId)
                                   .exec()
                                   .then(
                                       user => {
                                           const authorUsername = user.username;
                                           const authorProfilePicturePath = user.profilePicturePath;
                                           const listId = list._id.toString();
                                           const text = `${authorUsername} deleted the list "${ list.title }"`;
                                           return Notification.create({
                                               authorUsername,
                                               authorProfilePicturePath,
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
                                                       .emit("listDeleted", listId, text);
                                                   io.in(`list:${ listId }`).emit("listDeletedReload", listId);
                                                   io.in(`list:${ listId }`).socketsLeave(`list:${ listId }`);
                                                   io.in(`list:${ listId }:owner`).socketsLeave(`list:${ listId }:owner`);
                                               });

                                       },
                                       error => console.log(error)
                                   )
                           })
                           .then(_ =>
                               User.updateMany(
                                   { disabledNotificationsLists: list._id },
                                   { $pull: { disabledNotificationsLists: list._id } },
                                   { session }
                               )
                               .exec()
                           )
                           .then(_ => response.json(list));
            })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
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
    List.find(
        {
            members: {
                $elemMatch: Object.assign(
                    { userId: mongoose.Types.ObjectId(request.session.userId) },
                    request.query.shared === undefined ? {} : { role: request.query.shared === "true" ? "member" : "owner" }
                )
            }
        }
    )
    .exec()
    .then(
        lists => response.json(lists),
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getMembers(request, response) {
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    List.startSession()
        .then(session => session.withTransaction(() =>
            List.findById(request.params.id, undefined, { session })
                .exec()
                .then(list => {
                    if (list === null) {
                        sendError(response, Error.ResourceNotFound);
                        return Promise.resolve();
                    }
                    return Promise.all(list.members.map(member => {
                        if (member.anonymousId !== null) {
                            return Promise.resolve(
                                { _id: member._id, username: member.username, role: member.role, profilePicturePath: null }
                            );
                        }
                        return User.findById(member.userId, undefined, { session })
                                   .exec()
                                   .then(user => {
                                       if (user === null) {
                                           return Promise.resolve(null);
                                       }
                                       return Promise.resolve({
                                           _id: member._id,
                                           username: user.username,
                                           role: member.role,
                                           profilePicturePath:
                                               user.profilePicturePath === null
                                               ? null
                                               : "/static" + user.profilePicturePath
                                       });
                                   });
                    }))
                    .then(members => response.json(members.filter(m => m !== null)));
                })
    ))
    .catch(error => {
        console.log(error);
        sendError(response, Error.GeneralError);
    });
}

function updateListProperty(
    request,
    response,
    filterObject,
    updateObject,
    optionsObject = { new: true },
    onSuccess = (response, list) => response.json(list)
) {
    List.findOneAndUpdate(
        filterObject,
        updateObject,
        Object.assign({ runValidators: true, context: "query" }, optionsObject)
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            onSuccess(response, list);
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function updateUnprivilegedListProperty(
    request,
    response,
    updateObject,
    optionsObject = { new: true },
    onSuccess = (response, list) => response.json(list)
) {
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
        updateObject,
        optionsObject,
        onSuccess
    );
}

function updateTitle(request, response) {
    if (!validateRequest(request, response, ["title"], ["id"])) {
        return;
    }
    updateUnprivilegedListProperty(
        request,
        response,
        { $set: { title: request.body.title } },
        { new: false },
        (response, list) => {
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` changed the title of the list "${ list.title }" to "${ request.body.title }"`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("listTitleChanged", listId, text);
                                io.in(`list:${ listId }`).emit("listTitleChangedReload", listId);
                                const updatedList = JSON.parse(JSON.stringify(list));
                                updatedList.title = request.body.title;
                                response.json(updatedList);
                            });

                    },
                    error => console.log(error)
                )
        }
    );
}

function updateVisibility(request, response) {
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    const joinCode = otp.generate(6);
    updateListProperty(
        request,
        response,
        { _id: request.params.id, members: { $elemMatch: { userId: request.session.userId, role: "owner" } } },
        request.body.isVisible ? { $set: { joinCode } } : { $unset: { joinCode: "" } },
        { new: true },
        (response, list) => {
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();
                        const text = ` made the list "${ list.title }" ${ request.body.isVisible ? "" : "not " }visible to non members`;
                        Notification.create({
                            authorUsername,
                            authorProfilePicturePath,
                            users: list.members
                                .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                .map(m => m.userId),
                            text,
                            listId
                        })
                            .catch(error => console.log(error))
                            .then(_ => {
                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("listVisibilityChanged", listId, text);
                                io.in(`list:${ listId }`).emit("listVisibilityChangedReload", listId);
                                response.json(list);
                            });

                    },
                    error => console.log(error)
                )
        }
    );
}

function updateColorIndex(request, response) {
    if (!validateRequest(request, response, [], ["id"])) {
        return;
    }
    updateUnprivilegedListProperty(
        request,
        response,
        request.body.colorIndex ? { $set: { colorIndex: request.body.colorIndex } } : { $unset: { colorIndex: "" } },
        { new: true },
        (response, list) => {
            const listId = list._id.toString();
            io.in(`list:${ listId }`).emit("listColorChangedReload", listId);
        }
    );
}

function addMember(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["isAnonymous"], ["id"], true)) {
        return;
    }
    if ((!request.body.isAnonymous && !request.body.email)
        || (request.body.isAnonymous && (!request.body.socketId || !request.body.username))) {
        sendError(response, Error.RequestError);
        return;
    }
    if (!request.body.isAnonymous) {
        User.startSession()
            .then(session => session.withTransaction(() =>
                User.findOne({ email: request.body.email }, undefined,  { session })
                    .exec()
                    .then(user => {
                        if (user === null) {
                            sendError(response, Error.RequestError);
                            return;
                        }
                        const newMemberUserId = user._id.toString();
                        const newMemberUsername = user.username;
                        updateListProperty(
                            request,
                            response,
                            {
                                _id: mongoose.Types.ObjectId(request.params.id),
                                members: {
                                    $elemMatch: { userId: mongoose.Types.ObjectId(request.session.userId), role: "owner" },
                                    $not: { $elemMatch: { userId: user._id } }
                                }
                            },
                            { $push: { members: { userId: user._id } } },
                            { new: true, session },
                            (response, list) => {
                                User.findById(request.session.userId)
                                    .exec()
                                    .then(
                                        user => {
                                            const authorUsername = user.username;
                                            const authorProfilePicturePath = user.profilePicturePath;
                                            const listId = list._id.toString();
                                            const newMemberText = ` added you to the the list "${ list.title }"`;
                                            const oldMembersText = ` added the new member ${newMemberUsername} to the list "${ list.title }"`;
                                            Notification.create({
                                                authorUsername,
                                                authorProfilePicturePath,
                                                users: [newMemberUserId],
                                                text: newMemberText,
                                                listId
                                            })
                                                .catch(error => console.log(error))
                                                .then(_ => {
                                                    io.in(`user:${ newMemberUserId }`).emit("listSelfAdded", listId, newMemberText);
                                                    io.in(`user:${ newMemberUserId }`).emit("listSelfAddedReload", listId);
                                                })
                                                .then(_ => Notification.create({
                                                    authorUsername,
                                                    authorProfilePicturePath,
                                                    users: list.members
                                                        .filter(m => m.userId !== null
                                                                && m.userId.toString() !== request.session.userId
                                                                && m.userId.toString() !== newMemberUserId)
                                                        .map(m => m.userId),
                                                    text: oldMembersText,
                                                    listId
                                                }))
                                                .catch(error => console.log(error))
                                                .then(_ => {
                                                    io.in(`list:${ listId }`)
                                                        .except(`user:${ request.session.userId }`)
                                                        .emit("listMemberAdded", listId, oldMembersText);
                                                    io.in(`list:${ listId }`).emit("listMemberAddedReload", listId);
                                                    io.in(`user:${ newMemberUserId }`).socketsJoin(`list:${ listId }`);
                                                });
                                            response.json(list);

                                        },
                                        error => console.log(error)
                                    )
                            }
                        );
                    })
            ));
        return;
    }
    const anonymousId = uuid.v4();
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
        { $push: { members: { anonymousId, username: request.body.username } } },
        { new: true },
        (response, list) => {
            io.in(request.body.socketId).socketsJoin(`anon:${ anonymousId }`);
            const listId = list._id.toString();
            const text = ` joined the list "${ list.title }"`;
            Notification.create({
                authorUsername: request.body.username,
                authorProfilePicturePath: null,
                users: list.members
                           .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                           .map(m => m.userId),
                text,
                listId
            })
            .catch(error => console.log(error))
            .then(_ => {
                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("listMemberAdded", listId, text);
                io.in(`list:${ listId }`).emit("listMemberAddedReload", listId);
                io.in(request.body.socketId).socketsJoin(`list:${ list._id.toString() }`);
                response.json(list);
            });
        }
    );
}

function removeMember(request, response) {
    if (!validateRequest(request, response, [], ["id", "memberId"], true)) {
        return;
    }
    List.findOneAndUpdate(
        {
            _id: request.params.id,
            $or: [
                {
                    members: {
                        $elemMatch: { _id: request.params.memberId, userId: request.session.userId, role: { $ne: "owner" } }
                    }
                },
                {
                    $and: [
                        { members: { $elemMatch: { _id: request.params.memberId } } },
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
                }
            ]
        },
        { $pull: { members: { _id: request.params.memberId } } },
        { runValidators: true, new: false, context: "query" }
    )
    .exec()
    .then(
        list => {
            if (list === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            User.findById(request.session.userId)
                .exec()
                .then(
                    user => {
                        const authorUsername = user.username;
                        const authorProfilePicturePath = user.profilePicturePath;
                        const listId = list._id.toString();

                        const removedMemberUserId = list.members.filter(m => m._id.toString() === request.params.memberId)[0].userId

                        User.findById(removedMemberUserId)
                            .exec()
                            .then(user => {
                                const removedMemberUsername = user.username;
                                // if the member didn't leave the list
                                if (removedMemberUserId.toString() !== request.session.userId) {
                                    // it the member removed by the list owner was a registered user
                                    const memberRemovedByOwnerIndex = list.members.findIndex(m => m._id.toString() === request.params.memberId);
                                    const userText = ` removed you from the list "${ list.title }"`;
                                    if (removedMemberUserId !== null) {
                                        Notification.create({
                                            authorUsername,
                                            authorProfilePicturePath,
                                            users: [removedMemberUserId],
                                            text: userText,
                                            listId
                                        })
                                            .catch(error => console.log(error))
                                            .then(_ => {
                                                io.in(`user:${ removedMemberUserId }`).socketsLeave(`list:${ listId }`);
                                                io.in(`user:${ removedMemberUserId }`).emit("listSelfRemoved", listId, userText);
                                                io.in(`user:${ removedMemberUserId }`).emit("listSelfRemovedReload", listId);
                                            });

                                        const removalText = ` removed the member ${removedMemberUsername} from the list "${ list.title }"`;
                                        Notification.create({
                                            authorUsername,
                                            authorProfilePicturePath,
                                            users: list.members
                                                .filter(m => m.userId !== null
                                                    && m.userId.toString() !== request.session.userId
                                                    && m.userId.toString() !== removedMemberUserId.toString())
                                                .map(m => m.userId),
                                            text: removalText,
                                            listId
                                        })
                                            .catch(error => console.log(error))
                                            .then(_ => {
                                                io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("listMemberRemoved", listId, removalText);
                                                io.in(`list:${ listId }`).emit("listMemberRemovedReload", listId);
                                                const updatedList = JSON.parse(JSON.stringify(list));
                                                updatedList.members.splice(memberRemovedByOwnerIndex, 1);
                                                response.json(updatedList);
                                            });
                                    } else {
                                        io.in(`anon:${ list.members[memberRemovedByOwnerIndex].anonymousId }`).emit("listSelfRemoved", userText, listId);
                                        io.in(`anon:${ list.members[memberRemovedByOwnerIndex].userId }`).emit("listSelfRemovedReload", listId);
                                        io.in(`anon:${ list.members[memberRemovedByOwnerIndex].anonymousId }`).disconnectSockets();
                                    }
                                } else {
                                    const memberIndex = list.members.findIndex(m => m._id.toString() === request.params.memberId && m.userId === request.session.userId);
                                    const text = ` left the list "${ list.title }"`;
                                    Notification.create({
                                        authorUsername,
                                        authorProfilePicturePath,
                                        users: list.members
                                            .filter(m => m.userId !== null && m.userId.toString() !== request.session.userId)
                                            .map(m => m.userId),
                                        text,
                                        listId
                                    })
                                        .catch(error => console.log(error))
                                        .then(_ => {
                                            io.in(`list:${ listId }`).except(`user:${ request.session.userId }`).emit("listMemberRemoved", listId, text);
                                            io.in(`list:${ listId }`).emit("listMemberRemovedReload", listId);
                                            const updatedList = JSON.parse(JSON.stringify(list));
                                            updatedList.members.splice(memberIndex, 1);
                                            response.json(updatedList);
                                        });
                                }
                        })
                    },
                    error => console.log(error)
                )
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

module.exports = {
    createList,
    deleteList,
    getList,
    getUserLists,
    getMembers,
    updateTitle,
    updateVisibility,
    updateColorIndex,
    addMember,
    removeMember
}
