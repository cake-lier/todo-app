"use strict";

const User = require("../model/userModel.js").createUserModel();
const Notification = require("../model/notificationModel").createNotificationModel();
const achievements = [
    "6 months!",
    "1 year!",
    "2 years!",
    "5 items completed!",
    "10 items completed!",
    "25 items completed!",
    "50 items completed!",
    "100 items completed!",
    "150 items completed!",
    "200 items completed!",
    "you visited the reports page!",
    "your first collaboration!",
    "your first list!",
    "your first item!"
];

function addAchievement(userId, index, session) {
    if (!userId) {
        return Promise.resolve();
    }
    return User.findById(userId, undefined, { session })
               .exec()
               .then(user => {
                   if (user !== null && !user.achievements[index]) {
                       return User.findByIdAndUpdate(
                           userId,
                           { $set: { [`achievements.${index}`]: new Date() } },
                           { session, new: true, runValidators: true, context: "query" }
                       )
                       .exec()
                       .catch(error => console.log(error))
                       .then(_ => {
                           const text = "Achievement unlocked: " + achievements[index];
                           return Notification.create(
                               [{
                                   users: [userId],
                                   text,
                                   picturePath: `/images/achievements/${ index }.png`
                               }],
                               { session }
                           )
                           .catch(error => console.log(error))
                           .then(_ => {
                               io.in(`user:${ userId }`).emit("achievement", null, text);
                               io.in(`user:${ userId }`).emit("achievementReload", null);
                           });
                       });
                   }
                   return Promise.resolve();
               });
}

module.exports = {
    addAchievement
}
