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
        default: "/images/default_profile_picture.png"
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

userSchema.path("email").validate(
    function(email) {
        return this.model("User").count({ email }).exec().then(count => count === 0, _ => false);
    },
    "A user has already registered with this email, please choose another"
);

module.exports = {
    createUserModel: () => mongoose.model("User", userSchema)
};
