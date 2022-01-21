"use strict";

const validation = require("../utils/validation");
const uuid = require("uuid");
const User = require("../model/userModel").createUserModel();
const bcrypt = require("bcrypt");
const fs = require("fs");
const rounds = 12;

function decodeImage(encodedImage, response) {
    const matches = encodedImage.match(/^\s*data:image\/(png|jpg|jpeg);base64,(\S+)\s*$/);
    if (matches.length !== 3 || (matches[1] !== "png" && matches[1] !== "jpg" && matches[1] !== "jpeg")) {
        validation.sendError(response, validation.Error.RequestError);
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
        request.session.userId = user._id;
        response.json(createUserObject(user));
    });
}

function signup(request, response) {
    if (!validation.validateRequest(
        request,
        response,
        ["username", "email", "password"]
    )) {
        return;
    }
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
                          validation.sendError(response, validation.Error.GeneralError);
                          return;
                      }
                      createUser(request, response, path, hashedPassword).catch(error => {
                          console.log(error);
                          validation.sendError(response, validation.Error.GeneralError);
                      });
                  });
                  return Promise.resolve();
              }
              return createUser(request, response, null, hashedPassword);
          })
          .catch(error => {
              console.log(error);
              validation.sendError(response, validation.Error.GeneralError);
          });
}

function getUser(request, response) {
    if (!validation.validateRequest(request, response, [], [], true)) {
        return;
    }
    User.findById(request.session.userId)
        .exec()
        .then(
            user => {
                if (user === null) {
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return;
                }
                response.json(createUserObject(user));
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
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
    if (!validation.validateRequest(request, response, [], [], true)) {
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
                validation.sendError(response, validation.Error.GeneralError);
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
                            validation.sendError(response, validation.Error.ResourceNotFound);
                        });
                        return;
                    }
                    if (user.profilePicturePath !== null) {
                        fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                            if (error !== null) {
                                console.log(error);
                            }
                            response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, path));
                        });
                        return;
                    }
                    response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, path));
                },
                error => {
                    console.log(error);
                    validation.sendError(response, validation.Error.GeneralError);
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
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return;
                }
                if (user.profilePicturePath !== null) {
                    fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                        if (error !== null) {
                            console.log(error);
                        }
                        response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, null));
                    });
                    return;
                }
                response.json(createUpdatedUserDocument(user, request.body.username, request.body.email, null));
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
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
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return;
                }
                response.json(createUserObject(user));
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
            }
        );
    } else {
        validation.sendError(response, validation.Error.RequestError);
    }
}

function updatePassword(request, response) {
    const userId = request.session.userId;
    if (!validation.validateRequest(request, response, ["oldPassword", "newPassword"], [], true)) {
        return;
    }
    bcrypt.hash(request.body.newPassword, rounds)
          .then(newPassword =>
              User.findById(userId)
                  .exec()
                  .then(user => {
                      if (user === null) {
                          validation.sendError(response, validation.Error.ResourceNotFound);
                          return Promise.resolve();
                      }
                      return bcrypt.compare(request.body.oldPassword, user.password)
                                   .then(areEqual => {
                                       if (!areEqual) {
                                           validation.sendError(response, validation.Error.PasswordError);
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
                                               validation.sendError(response, validation.Error.GeneralError);
                                           } else {
                                               response.json(createUserObject(user));
                                           }
                                           return Promise.resolve();
                                       });
                                   })
                  })
          )
          .catch(error => {
              console.log(error);
              validation.sendError(response, validation.Error.GeneralError);
          });
}

function unregister(request, response) {
    const userId = request.session.userId;
    if (!validation.validateRequest(request, response, ["password"], [], true)) {
        return;
    }
    User.findById(userId)
        .exec()
        .then(user => {
            if (user === null) {
                validation.sendError(response, validation.Error.ResourceNotFound);
                return Promise.resolve();
            }
            return bcrypt.compare(request.body.password, user.password)
                         .then(areEqual => {
                             if (!areEqual) {
                                 validation.sendError(response, validation.Error.PasswordError);
                                 return Promise.resolve();
                             }
                             return User.findByIdAndDelete(userId)
                                        .exec()
                                        .then(result => {
                                            if (result.deleteCount === 0) {
                                                validation.sendError(response, validation.Error.GeneralError);
                                            } else if (user.profilePicturePath !== null) {
                                                fs.rm(appRoot + "/public" + user.profilePicturePath, error => {
                                                    if (error !==  null) {
                                                        console.log(error);
                                                    }
                                                    request.session.destroy(_ => response.send());
                                                });
                                            } else {
                                                request.session.destroy(_ => response.send());
                                            }
                                            return Promise.resolve();
                                        });
                         });
        })
        .catch(error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        });
}

function login(request, response) {
    if (!validation.validateRequest(request, response, ["email", "password"])) {
        return;
    }
    User.findOne({ email: request.body.email })
        .exec()
        .then(user => {
            if (user === null) {
                validation.sendError(response, validation.Error.LoginError);
                return Promise.resolve();
            }
            return bcrypt.compare(request.body.password, user.password)
                         .then(areEqual => {
                             if (!areEqual) {
                                 validation.sendError(response, validation.Error.LoginError);
                             } else {
                                 request.session.userId = user._id;
                                 response.json(createUserObject(user));
                             }
                             return Promise.resolve();
                         });
        })
        .catch(error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        });
}

function logout(request, response) {
    if (!validation.validateRequest(request, response, [], [], true)) {
        return;
    }
    request.session.destroy(_ => response.send());
}

module.exports = {
    signup,
    getUser,
    updateAccount,
    updatePassword,
    unregister,
    login,
    logout
}
