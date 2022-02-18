"use strict";

const User = require("../model/userModel.js").createUserModel();
const Notification = require("../model/notificationsModel").createNotificationModel();

/**
 * Sets the achievement at the specified index to true for the specified user.
 */
function addAchievement(userId, index, text) {
    User.findById(userId)
        .exec()
        .then(user => {
            if ( !user.achievements[index] ){ // check if not already set
                let achievements = [...user.achievements];
                achievements[index] = true;
                User.findByIdAndUpdate(
                    userId,
                    { $set: { achievements: achievements} },
                    { context: "query" }
                )
                    .exec()
                    .then(
                        _ => { },
                        error => {
                            console.log(error);
                        }
                    );

                Notification.create({
                    users: [userId],
                    text: "Achievement unlocked: " + text,
                    authorUsername: " ",
                    authorProfilePicturePath: `/images/achievements/${ index }.png`
                })
                    .catch(error => console.log(error))
                    .then(_ => {
                        io.in(`user:${ userId }`).emit("achievement", null, "Achievement unlocked: " + text);
                        io.in(`user:${ userId }`).emit("achievementReload");
                    });
            }
        });
}

module.exports = {
    addAchievement
}