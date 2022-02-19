"use strict";

const User = require("../model/userModel").createUserModel();
const Item = require("../model/itemModel").createItemModel();
const List = require("../model/listModel").createListModel();
const Notification = require("../model/notificationsModel").createNotificationModel();
const schedule = require("node-schedule");
const cron = require("node-cron");
const { addAchievement } = require("./achievements");
global.jobs = {};

function scheduleTasks() {
    Item.find({ reminderDate: { $gte: Date.now() } })
        .exec()
        .then(items => items.forEach(item => scheduleForDate(item.listId.toString(), item._id.toString(), item.reminderDate)));
    cron.schedule(
        "0 0 * * *",
        () => User.startSession()
                  .then(session => session.withTransaction(() =>
                      User.find(
                          {
                              $or: [
                                  {
                                      creationDate: { $lte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
                                      "achievements.0": null
                                  },
                                  {
                                      creationDate: { $lte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
                                      "achievements.1": null
                                  },
                                  {
                                      creationDate: { $lte: new Date(new Date().setFullYear(new Date().getFullYear() - 2)) },
                                      "achievements.2": null
                                  }
                              ]
                          },
                          undefined,
                          { session }
                      )
                      .exec()
                      .then(users => Promise.all(users.map(user => {
                          if (user.creationDate.valueOf() < new Date().setFullYear(new Date().getFullYear() - 2)) {
                              return addAchievement(user._id.toString(), 2, session);
                          }
                          if (user.creationDate.valueOf() < new Date().setFullYear(new Date().getFullYear() - 1)) {
                              return addAchievement(user._id.toString(), 1, session);
                          }
                          if (user.creationDate.valueOf() < new Date().setMonth(new Date().getMonth() - 6)) {
                              return addAchievement(user._id.toString(), 0, session);
                          }
                      })))
                  )),
        {
            timezone: "Europe/Rome"
        }
    );
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
                                const text = `Don't forget the item "${item.title}"` + (item.dueDate ? `: it's due ${ new Date(item.dueDate).toDateString().substr(3)}!`
                                    : `!`);
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
