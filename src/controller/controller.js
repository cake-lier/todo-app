function showIndex(_, response) {
    response.sendFile(appRoot  + '/public/index.html');
}

module.exports = {
    showIndex,
    user: require("./userController"),
    list: require("./listsController"),
    item: require("./itemsController")
}
