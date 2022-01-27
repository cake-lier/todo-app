"use strict";

const { validateRequest, sendError, Error } = require("../utils/validation");
const Notification = require("../model/notificationsModel").createNotificationModel();

function getUserNotifications(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    Notification.find({ users: { $elemMatch: { userId: request.session.userId } } })
                .exec()
                .then(
                    notifications => response.json(notifications),
                    error => {
                        console.log(error);
                        sendError(response, Error.GeneralError);
                    }
                );
}

function deleteNotification(request, response) {
    if (!validateRequest(request, response, [], ["id"], true)) {
        return;
    }
    Notification.findByIdAndUpdate(
        request.body.id,
        { $pull: { users: { userId: request.session.userId } } },
        { runValidators: true, context: "query", new: true }
    )
    .exec()
    .then(
        notification => {
            if (notification === null) {
                sendError(response, Error.ResourceNotFound);
                return;
            }
            if (notification.users.length === 0) {
                Notification.findByIdAndDelete(request.body.id).exec().catch(error => console.log(error));
            }
        },
        error => {
            console.log(error);
            sendError(response, Error.GeneralError);
        }
    );
}

module.exports = {
    getUserNotifications,
    deleteNotification
}
