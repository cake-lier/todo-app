const mongoose = require("mongoose");
const uuid = require("uuid");

const assigneeSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    anonymousId: {
        type: String,
        validate: uuid.validate
    },
    count: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        validate: Number.isInteger
    }
});

const itemSchema = new mongoose.Schema({
    listId: {
        type: mongoose.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: String,
    dueDate: Date,
    reminderDate: Date,
    completionDate: Date,
    tags: [String],
    count: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        validate: Number.isInteger
    },
    remainingCount: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        validate: Number.isInteger
    },
    assignees: [assigneeSchema]
});

module.exports = {
    createItemModel: () => mongoose.model("Item", itemSchema)
};
