"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicturePath: {
        type: String,
        default: null
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    disabledNotificationsLists: {
        type: [mongoose.ObjectId],
        default: []
    },
    achievements: {
        type: [Date],
        default: _.range(0, 14).map(_ => null)
    },
    completedTasks: {
        type: Number,
        default: 0
    }
});

userSchema.path("email").validate(
    function(email) {
        return mongoose.model("User").count({ email }).exec().then(count => count === 0, _ => false);
    },
    "A user has already registered with this email, please choose another"
);

module.exports = {
    createUserModel: () => mongoose.model("User", userSchema)
};
