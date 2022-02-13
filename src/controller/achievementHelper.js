"use strict";

const User = require("../model/userModel.js").createUserModel();

/**
 * Sets the achievement at the specified index to true for the specified user.
 */
function addAchievement(userId, index) {
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
            }
        })
}

module.exports = {
    addAchievement
}