"use strict";

const controller = require("../controller/controller");

function initializeUserRoutes(app) {
    app.route("/users").post(controller.user.signup);
    app.route("/users/me").delete(controller.user.unregister)
                          .get(controller.user.getUser);
    app.route("/users/me/session").post(controller.user.login)
                                  .delete(controller.user.logout);
    app.route("/users/me/username").put(controller.user.updateUsername);
    app.route("/users/me/password").put(controller.user.updatePassword);
    app.route("/users/me/profilePicture").put(controller.user.updateProfilePicture);
}

function initializeListRoutes(app) {
    app.route("/lists").post(controller.list.createList)
                       .get(controller.list.getUserLists);
    app.route("/lists/shared").get(controller.list.getUserSharedLists);
    app.route("/lists/:id").delete(controller.list.deleteList)
                           .get(controller.list.getList);
    app.route("/lists/:id/title").put(controller.list.updateTitle);
    app.route("/lists/:id/isVisible").put(controller.list.updateVisibility);
    app.route("/lists/:id/colorIndex").put(controller.list.updateColorIndex);
    app.route("/lists/:id/members").post(controller.list.addMember);
    app.route("/lists/:id/members/:memberId").delete(controller.list.removeMember);
    app.route("/lists/:id/items/").post(controller.item.createItem)
                                  .get(controller.item.getListItems);
}

function initializeItemRoutes(app) {
    app.route("/items").get(controller.item.getUserItems);
    app.route("/items/:id/title").put(controller.item.updateTitle);
    app.route("/items/:id/text").put(controller.item.updateText);
    app.route("/items/:id/dueDate").put(controller.item.updateDueDate);
    app.route("/items/:id/reminderDate").put(controller.item.updateReminderDate);
    app.route("/items/:id/complete").put(controller.item.updateCompletion);
    app.route("/items/:id/tags").post(controller.item.addTags)
                                .delete(controller.item.removeTags);
    app.route("/items/:id/count").put(controller.item.updateCount);
    app.route("/items/:id/assignees").post(controller.item.addAssignee);
    app.route("/items/:id/assignees/:assigneeId").delete(controller.item.removeAssignee);
}

function initializeStaticRoutes(app) {
    app.route("/").get(controller.showIndex);
}

module.exports = {
    initializeUserRoutes,
    initializeListRoutes,
    initializeItemRoutes,
    initializeStaticRoutes
};
