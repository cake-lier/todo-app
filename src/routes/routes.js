module.exports = {
    initRoutes: function(app) {
        const controller = require("../controller/controller.js");
        //app.route("/users")...;
        //app.route("/user")...;
        //app.route("/lists")...;
        //app.route("/list")...;
        //app.route("/items")...;
        //app.route("/item")...;
        //app.use(controller.showIndex);
        app.use((req, res) => {
            res.status(404).send("The requested resource was not found");
        });
    }
};
