"use strict";

const Item = require("../model/itemModel").createItemModel();
const List = require("../model/listModel").createListModel();
const schedule = require("node-schedule");
const { rrulestr } = require("rrule");
global.jobs = {};

function scheduleTasks() {
    Item.find({ $or: [{ dueDate: { $ne: null } }, { reminderString: { $ne: null } }] })
        .exec()
        .then(items => items.forEach(item => {
            const itemId = item._id.toString();
            const listId = item.listId.toString();
            if (item.dueDate !== null) {
                scheduleForDate(listId, itemId, item.dueDate);
            } else {
                scheduleNextReminder(listId, itemId, item.reminderString);
            }
        }));
}

function scheduleForDate(listId, itemId, date) {
    jobs[itemId] = schedule.scheduleJob(date, () => {
        List.findById(listId)
            .exec()
            .then(list => {
                if (list !== null) {
                    Item.findById(itemId)
                        .exec()
                        .then(item => {
                            if (item !== null) {
                                Notification.create({
                                    users: list.members.filter(m => m.userId !== null),
                                    text
                                })
                                .catch(error => console.log(error))
                                .then(_ => {
                                    io.in(`list:${ listId }`).emit("dueDateElapsed", `The item "${ item.title }" is now due`);
                                });
                            }
                        });
                }
            });
    });
}

function scheduleNextReminder(listId, itemId, recurrenceRuleString) {
    const nextRecurrence = rrulestr(recurrenceRuleString).after(new Date());
    if (nextRecurrence) {
        jobs[itemId] = schedule.scheduleJob(nextRecurrence, () => {
            List.findById(listId)
                .exec()
                .then(list => {
                    if (list !== null) {
                        Item.findById(itemId)
                            .exec()
                            .then(item => {
                                if (item !== null) {
                                    Notification.create({
                                        users: list.members.filter(m => m.userId !== null),
                                        title: item.title
                                    })
                                    .catch(error => console.log(error))
                                    .then(_ => io.in(`list:${ listId }`).emit("reminder", item.title));
                                    scheduleNextReminder(listId, itemId, recurrenceRuleString);
                                }
                            })
                    }
                })
        });
    }
}

module.exports = {
    scheduleTasks,
    scheduleForDate,
    scheduleNextReminder
}
