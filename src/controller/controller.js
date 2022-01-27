"use strict";

const { validateRequest } = require("../utils/validation");

function registerSocket(request, response) {
    if (!validateRequest(request, response, ["socketId"])) {
        return;
    }
    request.session.socketId = request.body.socketId;
    if (request.session.userId !== undefined) {
        io.in(request.session.socketId).socketsJoin(`user:${ request.session.userId }`);
    }
    response.send({});
}

module.exports = {
    registerSocket,
    user: require("./userController"),
    list: require("./listController"),
    item: require("./itemController"),
    notification: require("./notificationController")
}
