"use strict";

const List = require("../model/listModel").createListModel();
const { validateRequest } = require("../utils/validation");

function registerSocket(request, response) {
    if (!validateRequest(request, response, ["socketId"])) {
        return;
    }
    request.session.socketId = request.body.socketId;
    const userId = request.session.userId;
    if (userId !== undefined) {
        io.in(request.session.socketId).socketsJoin(`user:${ userId }`);
        List.find({ members: { $elemMatch: { userId } } })
            .exec()
            .then(lists => {
                lists.forEach(l => {
                    io.in(request.session.socketId).socketsJoin(`list:${ l._id.toString() }`);
                    if (
                        l.members
                         .filter(m => m.userId?.toString() === userId)
                         .every(m => m.role === "owner")
                    ) {
                        io.in(request.session.socketId).socketsJoin(`list:${ l._id.toString() }:owner`);
                    }
                });
                response.send({});
            });
        return;
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
