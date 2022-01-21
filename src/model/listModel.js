"use strict";

const mongoose = require("mongoose");
const uuid = require("uuid");

const memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        default: null
    },
    anonymousId: {
        type: String,
        default: null,
        validate: v => v === null || uuid.validate(v)
    },
    role: {
        type: String,
        enum: ["owner", "member"],
        default: "member"
    }
});

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    joinCode: {
        type: String,
        default: null,
        validate: v => v === null || uuid.validate(v)
    },
    colorIndex: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
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
            return mongoose.model("List")
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
            return mongoose.model("List")
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
        return mongoose.model("List").count({ joinCode }).exec().then(count => count === 0, _ => false);
    },
    "An error has occurred while adding this list, please retry"
);

module.exports = {
    createListModel: () => mongoose.model("List", listSchema)
}
