const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicturePath: {
        type: String,
        required: true,
        default: "/images/default_profile_picture.png"
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lists: [mongoose.ObjectId],
    items: [mongoose.ObjectId]
});

const bcrypt = require("bcrypt");
const rounds = 12;

userSchema.statics.createUser = function(username, email, password, profilePicturePath) {
    return this.startSession()
               .then(session => session.withTransaction(() => {
                   return this.findOne({ email })
                              .exec()
                              .then(user => {
                                  if (user) {
                                      return Promise.reject(new Error("A user has already registered with this email, please choose another"));
                                  }
                                  return Promise.resolve();
                              })
                              .then(_ => bcrypt.hash(password, rounds))
                              .then(hashedPassword => this.create({
                                  username,
                                  email,
                                  password: hashedPassword,
                                  profilePicturePath
                              }).exec());
               }));
}
userSchema.statics.getUser = function(userId) {
    return this.findById(userId);
}
userSchema.statics.updateUsername = function(userId, username) {
    return this.findByIdAndUpdate(userId, { $set: { username } }).exec();
}
userSchema.statics.updatePassword = function(userId, password) {
    return this.findByIdAndUpdate(userId, { $set: { password } }).exec();
}
userSchema.statics.updateProfilePicture = function(userId, profilePicturePath) {
    return this.findByIdAndUpdate(userId, { $set: { profilePicturePath } }).exec();
}
userSchema.statics.deleteUser = function(userId) {
    return this.findByIdAndDelete(userId).exec();
}
userSchema.statics.addList = function(userId, listId) {
    return this.findByIdAndUpdate(userId, { $push: { lists: listId } }).exec();
}
userSchema.statics.removeList = function(userId, listId) {
    return this.findByIdAndUpdate(userId, { $pull: { lists: listId } }).exec();
}
userSchema.statics.addItem = function(userId, itemId) {
    return this.findByIdAndUpdate(userId, { $push: { items: itemId } }).exec();
}
userSchema.statics.removeItem = function(userId, itemId) {
    return this.findByIdAndUpdate(userId, { $pull: { items: itemId } }).exec();
}

module.exports = {
    createUserModel: mongoose => mongoose.model("User", userSchema)
};
