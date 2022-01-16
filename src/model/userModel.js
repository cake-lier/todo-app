"use strict";

const mongoose = require("mongoose");
const defaultProfilePicture = "/public/images/profilePictures/default_profile_picture.png";

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
        default: defaultProfilePicture
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

userSchema.path("email").validate(
    function(email) {
        return mongoose.model("User").count({ email }).exec().then(count => count === 0, _ => false);
    },
    "A user has already registered with this email, please choose another"
);

module.exports = {
    createUserModel: () => mongoose.model("User", userSchema),
    defaultProfilePicture
};
