const uuid = require("uuid");
const User = require("../model/userModel.js").createUserModel();
const bcrypt = require("bcrypt");
const fs = require("fs");
const rounds = 12;

function decodeImage(encodedImage, response) {
    const matches = encodedImage.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        response.sendStatus(400);
        return;
    }
    if (matches[1] !== "png" && matches[1] !== "jpg" && matches[1] !== "jpeg") {
        response.sendStatus(400);
        return;
    }
    return ["/public/images/profilePictures/" + uuid.v4().replaceAll("-", "_") + "." + matches[1], Buffer.from(matches[2], "base64")];
}

function deletePassword(user) {
    const clone = JSON.parse(JSON.stringify(user));
    delete clone.password;
    return clone;
}

function createUser(request, response, path, hashedPassword) {
    User.create({
        username: request.body.username,
        email: request.body.email,
        password: hashedPassword,
        profilePicturePath: path
    })
    .then(
        user => {
            request.session.userId = user._id;
            response.json(deletePassword(user));
        },
        error => response.status(500).send(error)
    );
}

function signup(request, response) {
    bcrypt.hash(request.body.password, rounds)
          .then(hashedPassword => {
              if (request.body.profilePicture !== undefined) {
                  const result = decodeImage(request.body.profilePicture, response);
                  if (result.length < 2) {
                      return;
                  }
                  const [path, data] = result;
                  fs.writeFile(appRoot + path, data, { flag: "wx", encoding: "base64" }, error => {
                      if (error) {
                          response.status(500).send(error);
                          return;
                      }
                      createUser(request, response, path, hashedPassword);
                  });
              } else {
                  createUser(request, response, null, hashedPassword);
              }
          })
          .catch(error => response.status(500).send(error));
}

function getUser(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    User.findById(userId)
        .exec()
        .then(
            user => {
                if (user === null) {
                    response.sendStatus(404);
                    return;
                }
                response.json(deletePassword(user));
            },
            error => response.status(500).send(error)
        );
}

function updateUsername(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    User.findByIdAndUpdate(
        userId,
        { $set: { username: request.body.username } },
        { runValidators: true, new: true }
    )
    .exec()
    .then(
        user => {
            if (user === null) {
                response.sendStatus(404);
                return;
            }
            response.json(deletePassword(user));
        },
        error => response.status(500).send(error)
    );
}

function updatePassword(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    bcrypt.hash(request.body.password, rounds)
          .then(hashedPassword =>
              User.findByIdAndUpdate(
                  userId,
                  { $set: { password: hashedPassword } },
                  { runValidators: true, new: true }
              )
              .exec()
              .then(
                  user => {
                      if (user === null) {
                          response.sendStatus(404);
                          return;
                      }
                      response.json(deletePassword(user));
                  },
                  error => response.status(500).send(error)
              ));
}

function updateProfilePicture(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    const result = decodeImage(request.body.profilePicture, response);
    if (result.length < 2) {
        return;
    }
    const [path, data] = result;
    fs.writeFile(appRoot + path, data, { flag: "wx", encoding: "base64" }, error => {
        if (error) {
            response.status(500).send(error);
            return;
        }
        User.findByIdAndUpdate(userId, { $set: { profilePicturePath: path } }, { runValidators: true, new: true })
            .exec()
            .then(
                user => {
                    if (user === null) {
                        fs.rm(path, _ => response.sendStatus(404));
                        return;
                    }
                    response.json(deletePassword(user));
                },
                error => response.status(500).send(error)
            );
    });
}

function unregister(request, response) {
    const userId = request.session.userId;
    if (userId === undefined) {
        response.sendStatus(400);
        return;
    }
    User.findByIdAndDelete(userId, { runValidators: true })
        .exec()
        .then(
            result => {
                if (result.deletedCount === 0) {
                    response.sendStatus(404);
                    return;
                }
                request.session.destroy(_ => response.send());
            },
            error => response.status(500).send(error)
        );
}

function login(request, response) {
    User.findOne({ email: request.body.email })
        .exec()
        .then(user => {
            if (user === null) {
                throw new Error("Username or password are incorrect");
            }
            return user;
        })
        .then(user => bcrypt.compare(request.body.password, user.password)
                            .then(areEqual => {
                                if (!areEqual) {
                                    throw new Error("Username or password are incorrect");
                                }
                                request.session.user = JSON.parse(JSON.stringify(user));
                                response.json(deletePassword(user));
                            }))
        .catch(error => response.status(500).send(error))
}

module.exports = {
    signup,
    getUser,
    updateUsername,
    updatePassword,
    updateProfilePicture,
    unregister,
    login
}
