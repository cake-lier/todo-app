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
        "/static/images/profilePictures/" + uuid.v4().replaceAll("-", "_") + "." + matches[1],
        Buffer.from(matches[2], "base64")
    ];
}

function deletePassword(user) {
    const clone = JSON.parse(JSON.stringify(user));
    delete clone.password;
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
        response.json(deletePassword(user));
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
                  fs.writeFile(appRoot + path, data, { flag: "wx", encoding: "base64" }, error => {
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
                response.json(deletePassword(user));
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
            }
        );
}

function getProfilePicture(request, response) {
    if (!validation.validateRequest(request, response, [], [], true)) {
        return;
    }
    User.findById(request.params.id)
        .select('username profilePicturePath')
        .exec()
        .then(
            user => {
                if (user === null) {
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return;
                }
                response.json(user)
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
            }
        )
}

function updateUsername(request, response) {
    if (!validation.validateRequest(request, response, ["username"], [], true)) {
        return;
    }
    User.findByIdAndUpdate(
        request.session.userId,
        { $set: { username: request.body.username } },
        { runValidators: true, new: true, context: "query" }
    )
    .exec()
    .then(
        user => {
            if (user === null) {
                validation.sendError(response, validation.Error.ResourceNotFound);
                return;
            }
            response.json(deletePassword(user));
        },
        error => {
            console.log(error);
            validation.sendError(response, validation.Error.GeneralError);
        }
    );
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
                                               response.json(deletePassword(user));
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

function createUpdatedUserDocument(user, profilePicturePath) {
    const clone = JSON.parse(JSON.stringify(user));
    clone.profilePicturePath = profilePicturePath;
    delete clone.password;
    return clone;
}

function updateProfilePicture(request, response) {
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
        fs.writeFile(appRoot + path, data, { flag: "wx", encoding: "base64" }, error => {
            if (error !== null) {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
                return;
            }
            User.findByIdAndUpdate(
                userId,
                { $set: { profilePicturePath: path } },
                { runValidators: true, context: "query" }
            )
            .exec()
            .then(
                user => {
                    if (user === null) {
                        fs.rm(appRoot + path, error => {
                            if (error !== null) {
                                console.log(error);
                            }
                            validation.sendError(response, validation.Error.ResourceNotFound);
                        });
                        return;
                    }
                    if (user.profilePicturePath !== null) {
                        fs.rm(appRoot + user.profilePicturePath, error => {
                            if (error !== null) {
                                console.log(error);
                            }
                            response.json(createUpdatedUserDocument(user, path));
                        });
                        return;
                    }
                    response.json(createUpdatedUserDocument(user, path));
                },
                error => {
                    console.log(error);
                    validation.sendError(response, validation.Error.GeneralError);
                }
            );
        });
    } else {
        User.findByIdAndUpdate(
            userId,
            { $unset: { profilePicturePath: "" } },
            { runValidators: true, context: "query" }
        )
        .exec()
        .then(
            user => {
                if (user === null) {
                    validation.sendError(response, validation.Error.ResourceNotFound);
                    return;
                }
                if (user.profilePicturePath !== null) {
                    fs.rm(appRoot + user.profilePicturePath, error => {
                        if (error !== null) {
                            console.log(error);
                        }
                        response.json(createUpdatedUserDocument(user, null));
                    });
                    return;
                }
                response.json(createUpdatedUserDocument(user, null));
            },
            error => {
                console.log(error);
                validation.sendError(response, validation.Error.GeneralError);
            }
        );
    }
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
                                            } else if (user.profilePicturePath !== userModel.defaultProfilePicture) {
                                                fs.rm(appRoot + user.profilePicturePath, error => {
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
                                 response.json(deletePassword(user));
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
    getProfilePicture,
    updateUsername,
    updatePassword,
    updateProfilePicture,
    unregister,
    login,
    logout
}
