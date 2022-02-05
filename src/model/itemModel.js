"use strict";

const mongoose = require("mongoose");
const uuid = require("uuid");

const assigneeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        default: null
    },
    anonymousId: {
        type: String,
        default: null,
        validate: v => v === null || uuid.validate(v)
    },
    count: {
        type: Number,
        default: 1,
        min: 1,
        validate: Number.isInteger
    }
});

const tag = new mongoose.Schema({
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
    text: {
        type: String,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    reminderString: {
        type: String,
        default: null
    },
    completionDate: {
        type: Date,
        default: null
    },
    tags: [tag],
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
    }
});

module.exports = {
    createItemModel: () => mongoose.model("Item", itemSchema)
};
