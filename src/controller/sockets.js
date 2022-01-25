"use strict";

const List = require("../model/listModel").createListModel();
const User = require("../model/userModel.js").createUserModel();
const bcrypt = require("bcrypt");
global.sockets = {};

function setupSockets(server) {
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        socket.on("join", (joinCode, username, completionCallback) => {
            List.findOne({ joinCode })
                .exec()
                .then(
                    list => {
                        if (list === null) {
                            completionCallback({ success: false });
                        } else {
                            const listId = list._id.toString();
                            io.on(`list:${ listId }:owner`).emit("join", username, isApproved => {
                                if (isApproved) {
                                    completionCallback({
                                        success: true,
                                        listId
                                    });
                                    return;
                                }
                                completionCallback({
                                    success: true,
                                    listId: null
                                });
                            });
                        }
                    },
                    error => {
                        console.log(error);
                        completionCallback({ success: false });
                    }
                );
        });
        socket.on("login", (email, password, completionCallback) => {
            User.startSession()
                .then(session => session.withTransaction(() =>
                    User.findOne({ email }, undefined, { session })
                        .exec()
                        .then(user => {
                            if (user === null) {
                                completionCallback({ success: false });
                                return Promise.resolve();
                            }
                            return bcrypt.compare(password, user.password)
                                         .then(areEqual => {
                                             if (!areEqual) {
                                                 completionCallback({ success: false });
                                                 return Promise.resolve();
                                             }
                                             const userId = user._id.toString();
                                             return List.find(
                                                 { members: { $elemMatch: { userId } } },
                                                 undefined,
                                                 { session }
                                             )
                                             .exec()
                                             .then(lists => {
                                                 lists.forEach(l => {
                                                     sockets[userId] = (sockets[userId] ? sockets[userId] : []).push(socket);
                                                     socket.join(`list:${ l._id.toString() }`);
                                                     if (
                                                         l.members
                                                          .filter(m => m.userId.toString() === userId)[0]
                                                          .role
                                                         === "owner"
                                                     ) {
                                                         socket.join(`list:${ l._id.toString() }:owner`);
                                                     }
                                                 });
                                                 completionCallback({ success: true });
                                             });
                                         });
                        })
                ))
        });
    });
    return io;
}

function notifyRoomExceptSender(roomName, senderId, event) {
    sockets[senderId].forEach(s => s.leave(roomName));
    io.in(roomName).emit(event);
    sockets[senderId].forEach(s => s.join(roomName));
}

module.exports = {
    setupSockets,
    notifyRoomExceptSender
}
