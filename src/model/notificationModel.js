"use strict";

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    authorUsername: {
        type: String,
        default: null
    },
    picturePath: {
        type: String,
        default: null
    },
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
        default: null
    },
    listTitle: {
        type: String,
        default: null
    }
});

module.exports = {
    createNotificationModel: () => mongoose.model("Notification", notificationSchema)
}
