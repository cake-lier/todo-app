const mongoose = require("mongoose");

const assigneeSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    profilePicturePath: {
        type: String,
        required: true,
        default: "/images/default_profile_picture.png"
    },
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1,
        min: 1,
        validate: Number.isInteger
    }
});

const itemSchema = new mongoose.Schema({
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
        default: 1,
        min: 1,
        validate: Number.isInteger
    },
    assignees: [assigneeSchema]
});

itemSchema.statics.createItem = function(list, title, text, dueDate, reminderDate, completionDate, tags, count) {
    return this.create({
        listId: list._id,
        title,
        text,
        dueDate,
        reminderDate,
        completionDate,
        tags,
        count
    })
    .exec()
    .catch(console.log);
}
itemSchema.statics.getItem = function(itemId) {
    return this.findById(itemId).exec();
}
itemSchema.statics.getAllItems = function(...itemIds) {
    return this.find({ _id: { $in: itemIds } }).exec();
}
itemSchema.methods.updateTitle = function(title) {
    return this.model("Item").findByIdAndUpdate(this._id, { title }).exec();
}
itemSchema.methods.updateText = function(text) {
    return this.model("Item").findByIdAndUpdate(this._id, { text }).exec();
}
itemSchema.methods.updateDueDate = function (dueDate) {
    return this.model("Item").findByIdAndUpdate(this._id, { dueDate }).exec();
}
itemSchema.methods.updateReminderDate = function (reminderDate) {
    return this.model("Item").findByIdAndUpdate(this._id, { reminderDate }).exec();
}
itemSchema.methods.updateCompletionDate = function (completionDate) {
    return this.model("Item").findByIdAndUpdate(this._id, { completionDate }).exec();
}
itemSchema.methods.addTag = function(tag) {
    return this.model("Item").findByIdAndUpdate(this._id, { $addToSet: { tags: tag } }).exec();
}
itemSchema.methods.removeTag = function(tag) {
    return this.model("Item").findByIdAndUpdate(this._id, { $pull: { tags: tag } }).exec();
}
itemSchema.methods.updateCount = function(count) {
    return this.model("Item")
               .startSession()
               .then(session => session.withTransaction(() => {
                   this.model("Item")
                       .aggregate([
                           { $match: { _id: this._id } },
                           { $unwind: "$assignees" },
                           { $group: { _id: "$_id", count: { $sum: "$assignees.count" } } }
                       ], { session })
                       .exec()
                       .then(result => {
                           if (!Number.isInteger(count) || count < 1 || result.count > count) {
                               return Promise.reject(new Error("The provided count is an incorrect value"));
                           }
                           return Promise.resolve();
                       })
                       .then(_ => this.model("Item").findByIdAndUpdate(this._id, { $set: { count } }, { session }).exec())
               }));
}
itemSchema.methods.addRegisteredAssignee = function(user, count) {
    return this.model("Item")
               .startSession()
               .then(session => session.withTransaction(() => {
                   return this.model("Item")
                              .aggregate([
                                  { $match: { _id: this._id } },
                                  { $unwind: "$assignees" },
                                  { $group: { _id: "$_id", count: { $sum: "$assignees.count" } } }
                              ])
                              .exec()
                              .then(result => {
                                  if (!Number.isInteger(count) || count < 1 || this.count - result.count < count) {
                                      return Promise.reject(new Error("The provided count value is incorrect"));
                                  }
                                  return Promise.resolve();
                              })
                              .then(_ => this.model("Item")
                                             .findByIdAndUpdate(
                                                 this._id,
                                                 {
                                                     $push: {
                                                         assignees: {
                                                             userId: user._id,
                                                             profilePicturePath: user.profilePicturePath,
                                                             name: user.username,
                                                             count
                                                         }
                                                     }
                                                 }
                                             )
                                             .exec());
               }));
}
itemSchema.methods.addRegisteredAssignee = function(name, count) {
    return this.model("Item")
               .startSession()
               .then(session => session.withTransaction(() => {
                   return this.model("Item")
                              .aggregate([
                                  { $match: { _id: this._id } },
                                  { $unwind: "$assignees" },
                                  { $group: { _id: "$_id", count: { $sum: "$assignees.count" } } }
                              ])
                              .exec()
                              .then(result => {
                                  if (!Number.isInteger(count) || count < 1 || this.count - result.count < count) {
                                      return Promise.reject(new Error("The provided count value is incorrect"));
                                  }
                                  return Promise.resolve();
                              })
                              .then(_ => this.model("Item")
                                             .findByIdAndUpdate(this._id, { $push: { assignees: { name, count } } })
                                             .exec());
               }));
}
itemSchema.methods.removeAssignee = function(memberId) {
    return this.model("Item").findByIdAndUpdate(this._id, { $pull: { assignees: { _id: memberId } } }).exec();
}

module.exports = {
    createItemModel: mongoose => mongoose.model("Item", itemSchema)
};
