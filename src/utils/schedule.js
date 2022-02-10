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
                            if (item !== null) {
                                Notification.create({
                                    users: list.members.filter(m => m.userId !== null),
                                    listId,
                                    text: item.title
                                })
                                .catch(error => console.log(error))
                                .then(_ => io.in(`list:${ listId }`).emit("reminder", listId, item.title));
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
