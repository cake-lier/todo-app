const mongoose = require("mongoose");

const defaultProfilePicturePath = "/images/default_profile_picture.png"

const memberSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    profilePicturePath: {
        type: String,
        required: true,
        default: defaultProfilePicturePath
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["owner", "member"],
        required: true
    }
});

const listSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        required: true,
        default: "private"
    },
    colorIndex: {
        type: Number,
        enum: [0, 1, 2],
        required: true,
        default: 0
    },
    members: {
        type: [memberSchema],
        required: true
    },
    items: [mongoose.ObjectId]
});

listSchema.statics.createList = function(user, title, visibility, colorIndex) {
    return this.create({
        ownerId: user._id,
        title,
        visibility,
        colorIndex,
        members: [
            {
                userId: user._id,
                profilePicturePath: user.profilePicturePath,
                name: user.username,
                role: "owner"
            }
        ]
    })
    .exec()
    .catch(console.log);
}
listSchema.statics.getList = function(userId, listId) {
    return this.findOne({ _id: listId, members: { $elemMatch: { userId } } }).exec();
}
listSchema.statics.getAllLists = function(userId, ...listIds) {
    return this.find({ _id: { $in: listIds }, members: { $elemMatch: { userId } } }).exec();
}
listSchema.statics.updateTitle = function(userId, listId, title) {
    return this.findOneAndUpdate({ _id: listId, members: { $elemMatch: { userId } } }, { $set: { title } }).exec();
}
listSchema.statics.updateVisibility = function(userId, listId, visibility) {
    return this.findOneAndUpdate({ _id: listId, ownerId: userId },
                                 { $set: { visibility: (visibility === "public" ? "public" : "private") } })
               .exec();
}
listSchema.statics.updateColorIndex = function(userId, listId, colorIndex) {
    return this.findOneAndUpdate(
                   { _id: listId, members: { $elemMatch: { userId } } },
                   { $set: { colorIndex: (Number.isInteger(colorIndex) && colorIndex >= 0 && colorIndex <= 2 ? colorIndex : 0) } }
               )
               .exec();
}
listSchema.statics.addRegisteredMember = function(userId, listId, user) {
    return this.findOneAndUpdate(
                   { _id: listId, ownerId: userId },
                   {
                       $push: {
                           members: {
                               userId: user._id,
                               profilePicturePath: user.profilePicturePath,
                               name: user.name,
                               role: "member"
                           }
                       }
                   }
    )
    .exec();
}
listSchema.statics.addAnonymousMember = function(userId, listId, username) {
    return this.findOneAndUpdate(
                   { _id: listId, ownerId: userId },
                   {
                       $push: {
                           members: {
                               userId: undefined,
                               profilePicturePath: defaultProfilePicturePath,
                               name: username,
                               role: "member"
                           }
                       }
                   }
    )
    .exec();
}
listSchema.statics.removeMember = function(userId, listId, memberId) {
    if (userId === memberId) {
        return this.findByIdAndUpdate(listId, { $pull: { members: { _id: memberId } } }).exec();
    }
    return this.findOneAndUpdate({ _id: listId, ownerId: userId }, { $pull: { members: { _id: memberId } } }).exec();
}
listSchema.statics.addItem = function(userId, listId, itemId) {
    return this.findOneAndUpdate({ _id: listId, members: { $elemMatch: { userId } } }, { $push: { items: itemId } }).exec();
}
listSchema.statics.removeItem = function(userId, listId, itemId) {
    return this.findOneAndUpdate({ _id: listId, members: { $elemMatch: { userId } } }, { $pull: { items: itemId } }).exec();
}
listSchema.statics.deleteList = function(userId, listId) {
    return this.findOneAndDelete({ _id: listId, ownerId: userId }).exec();
}

module.exports = {
    createListModel: mongoose => mongoose.model("List", listSchema)
}
