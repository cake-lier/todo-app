"use strict";

const mongoose = require("mongoose");

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
    enableNotification: {
        type: Boolean,
        default: true
    },
    disabledListNotification: {
        type: [mongoose.ObjectId],
        default: []
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
