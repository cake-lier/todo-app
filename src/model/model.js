"use strict";

module.exports = {
    User: require("./userModel").createUserModel(),
    List: require("./listModel").createListModel(),
    Item: require("./itemModel").createItemModel(),
    Notification: require("./notificationModel").createNotificationModel()
}
