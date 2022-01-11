const uuid = require("uuid");
const mongoose = require("mongoose");
const User = require("../model/user.js").createUserModel(mongoose);
const List = require("../model/list.js").createListModel(mongoose);
const Item = require("../model/item.js").createItemModel(mongoose);

const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports = {
    createUser: function(request, response) {
        User.createUser(request.body.username, request.body.email, request.body.password, request.body.profilePicturePath)
            .then(
                user => {
                    delete user["password"];
                    request.session.userId = user._id;
                    response.json(user);
                },
                error => response.status(500).send(error)
            );
    },
    getUser: function(request, response) {
        User.getUser(request.params.id)
            .then(
                user => {
                    if (user === null) {
                        response.status(404).send();
                        return;
                    }
                    delete user["password"];
                    response.json(user);
                },
                error => response.status(500).send(error)
            );
    },
    updateUserUsername: function(request, response) {
        User.updateUsername(request.params.id, request.body.username)
            .then(
                user => {
                    if (user === null) {
                        response.status(404).send();
                        return;
                    }
                    delete user["password"];
                    response.json(user);
                },
                error => response.status(500).send(error)
            );
    },
    updateUserPassword: function(request, response) {
        User.updatePassword(request.params.id, request.body.password)
            .then(
                user => {
                    if (user === null) {
                        response.status(404).send();
                        return;
                    }
                    delete user["password"];
                    response.json(user);
                },
                error => response.status(500).send(error)
            );
    },
    updateUserProfilePicture: function(request, response) {
        const matches = request.body.profilePicture.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches !== 3) {
            response.status(400).send();
        }
        if (matches[1] !== "png" || matches[1] !== "jpg") {
            response.status(400).send();
        }
        const data = new Buffer(matches[2], "base64");
        const path = "view/images/" + uuid.v4() + "." + matches[1];
        fs.writeFile(path, data, "base64", error => {
            if (error) {
                response.status(500).send(error);
                return;
            }
            User.updateProfilePicture(request.params.id, path)
                .then(
                    user => {
                        if (user === null) {
                            fs.rm(path, _ => response.status(404).send());
                            return;
                        }
                        delete user["password"];
                        response.send(user);
                    },
                    error => response.status(500).send(error)
                );
        });

    },
    deleteUser: function(request, response) {
        User.deleteUser(request.params.id)
            .then(
                result => {
                    if (result.deletedCount === 0) {
                        response.status(404).send();
                    }
                    response.send();
                },
                error => response.status(500).send(error)
            );
    },
    createList: function(request, response) {
        User.getUser(request.params.id)
            .then(user => {
                if (user === null) {
                    response.status(404).send();
                    return;
                }
                return List.createList(user, request.body.title, request.body.visibility, request.body.colorIndex)
                           .then(list => User.addList(user._id, list._id)
                                             .then(user => {
                                                 if (user === null) {
                                                     throw new Error("An error has occurred while creating the list");
                                                 }
                                                 response.json(list);
                                             }));
            })
            .catch(error => response.status(500).send(error));
    },
    deleteList: function(request, response) {
        User.getUser(request.params.userId)
            .then(user => {
                if (user === null) {
                    response.status(404).send();
                    return;
                }
                return List.deleteList(user._id, request.params.listId)
                           .then(result => {
                               if (result.deletedCount === 0) {
                                   response.status(404).send();
                                   return;
                               }
                               return User.removeList(user._id, request.body.listId)
                                          .then(user => {
                                              if (user === null) {
                                                  throw new Error("An error has occurred while deleting the list");
                                              }
                                              response.send();
                                          });
                           });
            })
            .catch(error => response.status(500).send(error));
    },
    getList: function(request, response) {
        List.getList(request.params.userId, request.params.listId)
            .then(
                list => {
                    if (list === null) {
                        response.send(404).send();
                        return;
                    }
                    response.json(list);
                },
                error => response.status(500).send(error)
            );
    },
    getAllLists: function(request, response) {
        List.getAllLists(request.params.userId, ...request.body.listIds)
            .then(lists => response.json(lists), error => response.status(500).send(error));
    },
    updateListTitle: function(request, response) {
        List.updateTitle(request.params.userId, request.params.listId, request.body.title)
            .then(
                list => {
                    if (list === null) {
                        response.send(404).send();
                        return;
                    }
                    response.json(list);
                },
                error => response.status(500).send(error)
            );
    },
    updateListVisibility: function(request, response) {
        List.updateVisibility(request.params.userId, request.params.listId, request.body.visibility)
            .then(
                list => {
                    if (list === null) {
                        response.send(404).send();
                        return;
                    }
                    response.json(list);
                },
                error => response.status(500).send(error)
            );
    },
    updateListColorIndex: function(request, response) {
        List.updateColorIndex(request.params.userId, request.params.listId, request.body.colorIndex)
            .then(
                list => {
                    if (list === null) {
                        response.send(404).send();
                        return;
                    }
                    response.json(list);
                },
                error => response.status(500).send(error)
            );
    },
    addRegisteredMemberToList: function(request, response) {

    },
    addAnonymousMemberToList: function(request, response) {

    },
    removeMemberFromList: function(request, response) {

    },
    addItem: function(userId, item) {

    },
    removeItem: function(userId, item) {

    },
    login: (email, password) =>
        User.findOne({ email })
            .exec()
            .then(user => {
                if (user === null) {
                    return Promise.reject(new Error("Username or password are incorrect"));
                }
                return user;
            })
            .then(user => bcrypt.compare(password, user.password)
                                .then(areEqual => {
                                    if (!areEqual) {
                                        return Promise.reject(new Error("Username or password are incorrect"));
                                    }
                                    return Promise.resolve(user);
                                }))
            .catch(console.log),
}
