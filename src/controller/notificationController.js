"use strict";

const { validateRequest, sendError, Error } = require("../utils/validation");
const mongoose = require("mongoose");
const { Notification } = require("../model/model");

function getUserNotifications(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    Notification.find({ users: mongoose.Types.ObjectId(request.session.userId) })
                .sort('-insertionDate')
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
    Notification.startSession()
                .then(session => session.withTransaction(() =>
                    Notification.findOne(
                        {
                            _id: mongoose.Types.ObjectId(request.params.id),
                            users: mongoose.Types.ObjectId(request.session.userId)
                        },
                        undefined,
                        { session }
                    )
                    .exec()
                    .then(notification => {
                        if (notification === null) {
                            sendError(response, Error.ResourceNotFound);
                            return Promise.resolve();
                        }
                        if (notification.users.length === 1) {
                            return Notification.findByIdAndDelete(notification._id, { session })
                                               .exec()
                                               .then(deletedNotification => {
                                                   if (deletedNotification === null) {
                                                       sendError(response, Error.ResourceNotFound);
                                                   } else {
                                                       response.json(deletedNotification);
                                                   }
                                                   return Promise.resolve();
                                               });
                        }
                        return Notification.findByIdAndUpdate(
                            notification._id,
                            { $pull: { users: mongoose.Types.ObjectId(request.session.userId) } },
                            { runValidators: true, context: "query", new: true, session }
                        )
                        .exec()
                        .then(notification => {
                            if (notification === null) {
                                sendError(response, Error.ResourceNotFound);
                            } else {
                                response.json(notification);
                            }
                            return Promise.resolve();
                        });
                    })
                ))
                .catch(error => {
                    console.log(error);
                    sendError(response, Error.GeneralError);
                });
}

function deleteAllNotifications(request, response) {
    if (!validateRequest(request, response, [], [], true)) {
        return;
    }
    Notification.startSession()
                .then(session => session.withTransaction(() =>
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
                            ))
                            .then(_ => response.send({}));
                        })
                ));
}

module.exports = {
    getUserNotifications,
    deleteNotification,
    deleteAllNotifications
}
