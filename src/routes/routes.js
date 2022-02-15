"use strict";

const controller = require("../controller/controller");

function initializeUserRoutes(app) {
    app.route("/users").post(controller.user.signup);
    app.route("/users/me").delete(controller.user.unregister)
                          .get(controller.user.getUser);
    app.route("/users/me/session").post(controller.user.login)
                                  .delete(controller.user.logout);
    app.route("/users/me/account").put(controller.user.updateAccount);
    app.route("/users/me/password").put(controller.user.updatePassword);
    app.route("/users/me/notifications").get(controller.notification.getUserNotifications)
                                        .delete(controller.notification.deleteAllNotifications);
    app.route("/users/me/notifications/:id").delete(controller.notification.deleteNotification);
    app.route("/users/me/enableNotifications").put(controller.user.enableNotifications);
    app.route("/users/me/enableListNotifications").put(controller.user.enableListNotifications);
    app.route("/users/me/achievements").get(controller.user.getAchievements)
                                        .put(controller.user.addReportsAchievement);
}

function initializeListRoutes(app) {
    app.route("/lists").post(controller.list.createList)
                       .get(controller.list.getUserLists);
    app.route("/lists/:id").delete(controller.list.deleteList)
                           .get(controller.list.getList);
    app.route("/lists/:id/title").put(controller.list.updateTitle);
    app.route("/lists/:id/isVisible").put(controller.list.updateVisibility);
    app.route("/lists/:id/colorIndex").put(controller.list.updateColorIndex);
    app.route("/lists/:id/members").get(controller.list.getMembers)
                                   .post(controller.list.addMember);
    app.route("/lists/:id/members/:memberId").delete(controller.list.removeMember);
    app.route("/lists/:id/items/").post(controller.item.createItem)
                                  .get(controller.item.getListItems);
}

function initializeItemRoutes(app) {
    app.route("/items").get(controller.item.getUserItems);
    app.route("/items/:id").delete(controller.item.deleteItem);
    app.route("/items/:id/title").put(controller.item.updateTitle);
    app.route("/items/:id/dueDate").put(controller.item.updateDueDate);
    app.route("/items/:id/reminderDate").put(controller.item.updateReminderDate);
    app.route("/items/:id/complete").put(controller.item.updateCompletion);
    app.route("/items/:id/tags").post(controller.item.addTag);
    app.route("/items/:id/tags/:tagId").delete(controller.item.removeTag);
    app.route("/items/:id/count").put(controller.item.updateCount);
    app.route("/items/:id/assignees").get(controller.item.getAssignees)
                                     .post(controller.item.addAssignee);
    app.route("/items/:id/assignees/:assigneeId").put(controller.item.updateAssignee)
                                                 .delete(controller.item.removeAssignee);
    app.route("/items/:id/priority").put(controller.item.updatePriority);
}

function initializeStaticRoutes(app) {
    app.route("/socket").post(controller.registerSocket);
}

module.exports = {
    initializeUserRoutes,
    initializeListRoutes,
    initializeItemRoutes,
    initializeStaticRoutes
};
