const mongoose = require("mongoose");
const uuid = require("uuid");

const memberSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    anonymousId: {
        type: String,
        validate: uuid.validate
    },
    role: {
        type: String,
        enum: ["owner", "member"],
        required: true
    }
});

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    joinCode: {
        type: String,
        validate: uuid.validate
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
    }
});

memberSchema.path("userId").validate(
    function(userId) {
        if (userId !== undefined) {
            return this.model("List")
                       .count({ members: { $elemMatch: { userId: null, anonymousId: null } } })
                       .exec()
                       .then(count => count === 0, _ => false)
        }
        return Promise.resolve(true);
    },
    "An error has occurred while adding a registered member to this list, please retry"
);

memberSchema.path("anonymousId").validate(
    function(userId) {
        if (userId !== undefined) {
            return this.model("List")
                       .count({ members: { $elemMatch: { userId: null, anonymousId: null } } })
                       .exec()
                       .then(count => count === 0, _ => false)
        }
        return Promise.resolve(true);
    },
    "An error has occurred while adding an anonymous member to this list, please retry"
);

listSchema.path("joinCode").validate(
    function(joinCode) {
        this.model("List").count({ joinCode }).exec().then(count => count === 0, _ => false);
    },
    "An error has occurred while adding this list, please retry"
);

module.exports = {
    createListModel: () => mongoose.model("List", listSchema)
}
