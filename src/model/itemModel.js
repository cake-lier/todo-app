"use strict";

const mongoose = require("mongoose");

const assigneeSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.ObjectId,
        required: true,
    },
    count: {
        type: Number,
        default: 1,
        min: 0,
        validate: Number.isInteger
    }
});

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    colorIndex: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 0
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
    dueDate: {
        type: Date,
        default: null
    },
    reminderDate: {
        type: Date,
        default: null
    },
    completionDate: {
        type: Date,
        default: null
    },
    tags: {
        type: [tagSchema],
        default: []
    },
    count: {
        type: Number,
        default: 1,
        min: 0,
        validate: Number.isInteger
    },
    remainingCount: {
        type: Number,
        default: 1,
        min: 0,
        validate: Number.isInteger
    },
    assignees: {
        type: [assigneeSchema],
        required: true
    },
    priority: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    createItemModel: () => mongoose.model("Item", itemSchema)
};
