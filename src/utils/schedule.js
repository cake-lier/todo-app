"use strict";

const Item = require("../model/itemModel").createItemModel();
const List = require("../model/listModel").createListModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const schedule = require("node-schedule");
global.jobs = {};

function scheduleTasks() {
    Item.find({ reminderDate: { $gte: Date.now() } })
        .exec()
        .then(items => items.forEach(item => {
            const itemId = item._id.toString();
            const listId = item.listId.toString();
            scheduleForDate(listId, itemId, item.reminderDate);
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
                            const text = `Don't forget the item "${item.title}"` + (item.dueDate ? `: it's due ${ new Date(item.dueDate).toDateString().substr(3)}!`
                                : `!`);
                            if (item !== null) {
                                Notification.create({
                                    users: list.members.filter(m => m.userId !== null).map(m => m.userId),
                                    listId,
                                    text: text
                                })
                                .catch(error => console.log(error))
                                .then(_ => io.in(`list:${ listId }`).emit("reminder", listId, text));
                            }
                        });
                }
            });
    });
}

module.exports = {
    scheduleTasks,
    scheduleForDate
}
