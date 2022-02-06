"use strict";

const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    users: {
        type: [mongoose.ObjectId],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    insertionDate: {
        type: Date,
        default: Date.now
    },
    listId: {
        type: mongoose.ObjectId,
        required: true
    }
});

module.exports = {
    createNotificationModel: () => mongoose.model("Notification", notificationsSchema)
}
