"use strict";

const { Error, validateRequest, sendError } = require("../utils/validation");
const uuid = require("uuid");
const User = require("../model/userModel").createUserModel();
const List = require("../model/listModel").createListModel();
const Item = require("../model/itemModel").createItemModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const bcrypt = require("bcrypt");
const fs = require("fs");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const achievementHelper = require("./achievementHelper");
const _ = require("lodash");
const rounds = 12;

function decodeImage(encodedImage, response) {
    const matches = encodedImage.match(/^\s*data:image\/(png|jpg|jpeg);base64,(\S+)\s*$/);
    if (matches.length !== 3 || (matches[1] !== "png" && matches[1] !== "jpg" && matches[1] !== "jpeg")) {
        sendError(response, Error.RequestError);
        return [];
    }
    return [
        "/images/profilePictures/" + uuid.v4().replaceAll("-", "_") + "." + matches[1],
        Buffer.from(matches[2], "base64")
    ];
}

function createUserObject(user) {
    const clone = JSON.parse(JSON.stringify(user));
    delete clone.password;
    clone.profilePicturePath =
        "/static" + (clone.profilePicturePath === null ? "/images/default_profile_picture.jpg": clone.profilePicturePath);
    return clone;
}

function createUser(request, response, path, hashedPassword) {
    return User.create({
        username: request.body.username,
        email: request.body.email,
        password: hashedPassword,
        profilePicturePath: path
    })
    .then(user => {
        const userId = user._id.toString();
        request.session.userId = userId;
        io.in(request.session.socketId).socketsJoin(`user:${ userId }`);
        response.json(createUserObject(user));
    });
}

function signup(request, response) {
    if (!validateRequest(
        request,
        response,
        ["username", "email", "password"]
    )) {
        return;
    }

    // achievements
    // TODO possibly look into another library (i.e. agenda) for permanence
    const now = new Date();
    const date0 = new Date().setMonth(now.getMonth() + 6);
    schedule.scheduleJob(date0, function (){
        achievementHelper.addAchievement(request.session.userId, 0, "6 months!");
    })

    const date1 = new Date().setFullYear(now.getFullYear() + 1);
    schedule.scheduleJob(date1, function (){
        achievementHelper.addAchievement(request.session.userId, 1, "1 year!");
    })

    const date2 = new Date().setFullYear(now.getFullYear() + 2);
    schedule.scheduleJob(date2, function (){
        achievementHelper.addAchievement(request.session.userId, 2, "2 years!");
    })

    // ---

    bcrypt.hash(request.body.password, rounds)
          .then(hashedPassword => {
              if (request.body.profilePicture) {
                  const result = decodeImage(request.body.profilePicture, response);
                  if (result.length < 2) {
                      return Promise.resolve();
                  }
                  const [path, data] = result;
                  fs.writeFile(appRoot + "/public" + path, data, { flag: "wx", encoding: "base64" }, error => {
                      if (error !== null) {
                          console.log(error);
                          sendError(response, Error.GeneralError);
                          return;
                      }
                      createUser(request, response, path, hashedPassword).catch(error => {
                          console.log(error);
                          sendError(response, Error.GeneralError);
                      });
                  });
                  return Promise.resolve();
              }
              return createUser(request, response, null, hashedPassword);
          })
          .catch(error => {
              console.log(error);
              sendError(response, Error.GeneralError);
          });
}

function getUser(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    User.findById(request.session.userId)
        .exec()
        .then(
            user => {
                if (user === null) {
                    sendError(response, Error.ResourceNotFound);
                    return;
                }
                response.json(createUserObject(user));
            },
            error => {
                console.log(error);
                sendError(response, Error.GeneralError);
            }
        );
}

function createUpdatedUserDocument(user, username, email, profilePicturePath) {
    const clone = JSON.parse(JSON.stringify(user));
    if (username !== undefined) {
        clone.username = username;
    }
    if (email !== undefined) {
        clone.email = email;
    }
    clone.profilePicturePath =
        "/static" + (profilePicturePath === null ? "/images/default_profile_picture.jpg": profilePicturePath);
    delete clone.password;
    return clone;
}

function updateAccount(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    if (typeof request.body.profilePicture === "string") {
        const result = decodeImage(request.body.profilePicture, response);
        if (result.length < 2) {
            return;
        }
        const [path, data] = result;
        fs.writeFile(appRoot + "/public" + path, data, { flag: "wx", encoding: "base64" }, error => {
            if (error !== null) {
                console.log(error);
                sendError(response, Error.GeneralError);
                return;
            }
            User.findByIdAndUpdate(
                userId,
                {
                    $set: { profilePicturePath: path, email: request.body.email, username: request.body.username }
                },
                { context: "query" }
            )
            .exec()
            .then(
                user => {
                    if (user === null) {
                        fs.rm(appRoot + "/public" + path, error => {
                            if (error !== null) {
                                console.log(error);
                            }
                            sendError(response, Error.ResourceNotFound);
                        });
                        return;
                    }
                    if (user.profilePicturePath !== null) {
                        fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                            if (error !== null) {
                                console.log(error);
                            }
                            io.in(`user:${ userId.toString() }`).except(request.session.socketId).emit("userDataReload");
                            response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, path));
                        });
                        return;
                    }
                    io.in(`user:${ userId.toString() }`).except(request.session.socketId).emit("userDataReload");
                    response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, path));
                },
                error => {
                    console.log(error);
                    sendError(response, Error.GeneralError);
                }
            );
        });
    } else if (request.body.profilePicture === null) {
        User.findByIdAndUpdate(
            userId,
            { $set: { email: request.body.email, username: request.body.username }, $unset: { profilePicturePath: "" } },
            { context: "query" }
        )
        .exec()
        .then(
            user => {
                if (user === null) {
                    sendError(response, Error.ResourceNotFound);
                    return;
                }
                if (user.profilePicturePath !== null) {
                    fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                        if (error !== null) {
                            console.log(error);
                        }
                        io.in(`user:${ userId.toString() }`).except(request.session.socketId).emit("userDataReload");
                        response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, null));
                    });
                    return;
                }
                io.in(`user:${ userId.toString() }`).except(request.session.socketId).emit("userDataReload");
                response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, null));
            },
            error => {
                console.log(error);
                sendError(response, Error.GeneralError);
            }
        );
    } else if (request.body.profilePicture === undefined) {
        User.findByIdAndUpdate(
            request.session.userId,
            { $set: { email: request.body.email, username: request.body.username } },
            { new: true, context: "query" }
        )
        .exec()
        .then(
            user => {
                if (user === null) {
                    sendError(response, Error.ResourceNotFound);
                    return;
                }
                io.in(`user:${ user._id.toString() }`).except(request.session.socketId).emit("userDataReload");
                response.json(createUserObject(user));
            },
            error => {
                console.log(error);
                sendError(response, Error.GeneralError);
            }
        );
    } else {
        sendError(response, Error.RequestError);
    }
}

function updatePassword(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["oldPassword", "newPassword"], [], true)) {
        return;
    }
    bcrypt.hash(request.body.newPassword, rounds)
          .then(newPassword =>
              User.findById(userId)
                  .exec()
                  .then(user => {
                      if (user === null) {
                          sendError(response, Error.ResourceNotFound);
                          return Promise.resolve();
                      }
                      return bcrypt.compare(request.body.oldPassword, user.password)
                                   .then(areEqual => {
                                       if (!areEqual) {
                                           sendError(response, Error.PasswordError);
                                           return Promise.resolve();
                                       }
                                       return User.findByIdAndUpdate(
                                           userId,
                                           { $set: { password: newPassword } },
                                           { runValidators: true, new: true, context: "query" }
                                       )
                                       .exec()
                                       .then(user => {
                                           if (user === null) {
                                               sendError(response, Error.GeneralError);
                                           } else {
                                               io.in(`user:${ user._id.toString() }`)
                                                 .except(request.session.socketId)
                                                 .disconnectSockets();
                                               store.all((error, sessions) => {
                                                   if (error) {
                                                       response.json(createUserObject(user));
                                                       return;
                                                   }
                                                   const userSessions =
                                                       sessions.filter(s => s.session.userId === request.session.userId
                                                                            && s._id !== request.session.id);
                                                   if (userSessions.length === 0) {
                                                       response.json(createUserObject(user));
                                                       return;
                                                   }
                                                   let destroyedSessions = 0;
                                                   userSessions.forEach(s => store.destroy(s._id, () => {
                                                       destroyedSessions++;
                                                       if (destroyedSessions === userSessions.length) {
                                                           response.json(createUserObject(user));
                                                       }
                                                   }));
                                               });
                                           }
                                           return Promise.resolve();
                                       });
                                   })
                  })
          )
          .catch(error => {
              console.log(error);
              sendError(response, Error.GeneralError);
          });
}

function sendNotification(userId, list, eventName, text) {
    const listId = list._id.toString();
    return Notification.create({
        users: list.members.filter(m => m.userId !== null && m.userId.toString() !== userId).map(m => m.userId),
        text,
        listId
    })
    .catch(error => console.log(error))
    .then(_ => {
        io.in(`list:${ listId }`).except(`user:${ userId }`).emit(eventName, listId, text);
        io.in(`list:${ listId }`).except(`user:${ userId }`).emit(eventName + "Reload", listId);
    });
}

function deleteUserData(request, response, session, user) {
    return List.find({ members: { $elemMatch: { userId: user._id, role: "owner" } } }, undefined, { session })
               .exec()
               .then(lists => {
                   const listIds = lists.map(l => l._id);
                   return List.deleteMany({ _id: { $in: listIds } }, { session })
                              .exec()
                              .then(_ => Item.deleteMany({ listId: { $in: listIds } }, { session }).exec())
                              .then(_ => Promise.all(lists.map(list => {
                                  const listId = list._id.toString();
                                  const listText = `The list "${ list.title }" has just been deleted`;
                                  return Notification.create({
                                      users: list.members.filter(m => m.userId !== null && m.userId !== request.session.userId).map(m => m.userId),
                                      text: listText,
                                      listId
                                  })
                                  .catch(error => console.log(error))
                                  .then(_ => {
                                      io.in(`list:${ listId }`)
                                        .except(`user:${ request.session.userId }`)
                                        .emit("listDeleted", listId, listText);
                                      io.in(`list:${ listId }`)
                                        .except(`user:${ request.session.userId }`)
                                        .emit("listDeletedReload", listId);
                                      return Item.find({ listId: list._id }, undefined, { session })
                                                 .exec()
                                                 .then(items => Promise.all(items.map(item => {
                                                     jobs[item._id.toString()]?.cancel();
                                                     return sendNotification(
                                                         request.session.userId,
                                                         list,
                                                         "itemDeleted",
                                                         `The item "${ item.title }" has just been deleted`
                                                     );
                                                 })));
                                  })
                                  .then(_ => {
                                      io.in(`list:${ listId }`).socketsLeave(`list:${ listId }`);
                                      io.in(`list:${ listId }:owner`).socketsLeave(`list:${ listId }:owner`);
                                  });
                              })));
               })
               .then(_ =>
                   List.find({ members: { $elemMatch: { userId: user._id, role: "member" } } }, undefined, { session })
                       .exec()
                       .then(lists =>
                           List.updateMany(
                               { _id: lists.map(l => l._id) },
                               { $pull: { members: { userId: user._id, role: "member" } } },
                               { session }
                           )
                           .exec()
                           .then(_ => Promise.all(lists.map(list => sendNotification(
                               request.session.userId,
                               list,
                               "listMemberRemoved",
                               `A member has left from the list "${ list.title }"`
                           ))))
                       )
               )
               .then(_ =>
                   Item.find({ assignees: { $elemMatch: { userId: user._id } } }, undefined, { session })
                       .exec()
                       .then(items =>
                           Item.updateMany(
                               { _id: { $in: items.map(i => i._id) } },
                               { $pull: { assignees: { userId: user._id } } },
                               { session }
                           )
                           .exec()
                           .then(_ => Promise.all(items.map(item =>
                               List.findById(item.listId, undefined, { session })
                                   .exec()
                                   .then(list => {
                                       if (list !== null) {
                                           return sendNotification(
                                               request.session.userId,
                                               list,
                                               "itemAssigneeRemoved",
                                               `An assignee was removed from the item "${ item.title }"`
                                           );
                                       }
                                       return Promise.resolve();
                                   })
                               )))
                       )
               )
               .then(_ =>
                   Notification.find(
                       { users: mongoose.Types.ObjectId(request.session.userId) },
                       undefined,
                       { session }
                   )
                   .exec()
                   .then(notifications => {
                       const updateIds = [];
                       const deleteIds = [];
                       notifications.forEach(notification => {
                           if (notification.users.length === 1) {
                               deleteIds.push(notification._id);
                           } else {
                               updateIds.push(notification._id);
                           }
                       });
                       return (
                           updateIds.length > 0
                           ? Notification.updateMany(
                               { _id: { $in: updateIds } },
                               { $pull: { users: mongoose.Types.ObjectId(request.session.userId) } },
                               { session }
                             )
                             .exec()
                           : Promise.resolve()
                       ).then(_ => (
                           deleteIds.length > 0
                           ? Notification.deleteMany(
                               { _id: { $in: deleteIds } },
                               { session }
                             ).exec()
                           : Promise.resolve()
                       ));
                   })
               )
               .then(_ => {
                   io.in(`user:${ user._id.toString() }`).disconnectSockets();
                   store.all((error, sessions) => {
                       if (error) {
                           request.session.destroy(_ => response.send({}));
                           return;
                       }
                       const userSessions = sessions.filter(s => s.userId === request.session.userId);
                       let destroyedSessions = 0;
                       userSessions.forEach(s => s.destroy(() => {
                           destroyedSessions++;
                           if (destroyedSessions === userSessions.length) {
                               response.send({});
                           }
                       }));
                   });
               });
}

function unregister(request, response) {
    const userId = request.session.userId;
    if (!validateRequest(request, response, ["password"], [], true)) {
        return;
    }
    User.startSession()
        .then(session => session.withTransaction(() =>
            User.findById(userId, undefined, { session })
                .exec()
                .then(user => {
                    if (user === null) {
                        sendError(response, Error.ResourceNotFound);
                        return Promise.resolve();
                    }
                    return bcrypt.compare(request.body.password, user.password)
                                 .then(areEqual => {
                                     if (!areEqual) {
                                         sendError(response, Error.PasswordError);
                                         return Promise.resolve();
                                     }
                                     return User.findByIdAndDelete(userId, {session})
                                         .exec()
                                         .then(deletedUser => {
                                             if (deletedUser === null) {
                                                 sendError(response, Error.GeneralError);
                                                 return Promise.resolve();
                                             }
                                             if (user.profilePicturePath !== null) {
                                                 fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                                                     if (error !== null) {
                                                         console.log(error);
                                                     }
                                                 });
                                             }
                                             return deleteUserData(request, response, session, user);
                                         });
                                 });
                })
        ))
        .catch(error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        });
}

function login(request, response) {
    if (!validateRequest(request, response, ["email", "password"])) {
        return;
    }
    User.startSession()
        .then(session => session.withTransaction(() =>
            User.findOne({ email: request.body.email })
                .exec()
                .then(user => {
                    if (user === null) {
                        sendError(response, Error.LoginError);
                        return Promise.resolve();
                    }
                    return bcrypt.compare(request.body.password, user.password)
                                 .then(areEqual => {
                                     if (!areEqual) {
                                         sendError(response, Error.LoginError);
                                         return Promise.resolve();
                                     }
                                     const userId = user._id.toString();
                                     request.session.userId = userId;
                                     io.in(request.session.socketId).socketsJoin(`user:${ userId }`);
                                     return List.find(
                                         { members: { $elemMatch: { userId } } },
                                         undefined,
                                         { session }
                                     )
                                     .exec()
                                     .then(lists => {
                                         lists.forEach(l => {
                                             io.in(request.session.socketId).socketsJoin(`list:${ l._id.toString() }`);
                                             if (
                                                 l.members
                                                  .filter(m => m.userId.toString() === userId)
                                                  .every(m => m.role === "owner")
                                             ) {
                                                 io.in(request.session.socketId).socketsJoin(`list:${ l._id.toString() }:owner`);
                                             }
                                         });
                                         response.json(createUserObject(user));
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

function logout(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    request.session.destroy(_ => response.send({}));
}

function enableNotifications(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    User.findByIdAndUpdate(
        request.session.userId,
        { $set: { notificationsEnabled: request.body.enabled } },
        { runValidators: true, context: "query", new: true }
    )
    .exec()
    .then(
        user => {
            if (user === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            response.json(createUserObject(user));
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function enableListNotifications(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    User.findByIdAndUpdate(
        request.session.userId,
        request.body.enabled
        ? { $pull: { disabledNotificationsLists: request.body.listId } }
        : { $push: { disabledNotificationsLists: request.body.listId } },
        { runValidators: true, context: "query", new: true }
    )
    .exec()
    .then(
        user => {
            if (user === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            response.json(createUserObject(user));
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

function getAchievements(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }

    User.findById(request.session.userId)
        .exec()
        .then(user => {
            if (user === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            response.json(user.achievements);
        });
}

function addReportsAchievement(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }

    achievementHelper.addAchievement(request.session.userId, 10, "you visited the reports page!");

}

module.exports = {
    signup,
    getUser,
    updateAccount,
    updatePassword,
    enableNotifications,
    enableListNotifications,
    unregister,
    login,
    logout,
    getAchievements,
    addReportsAchievement
}
