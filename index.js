const express = require("express");
const path = require("path");
global.appRoot = path.resolve(__dirname);
require("mongoose").connect("mongodb://Eli-PC:27017,Eli-PC:27018,Eli-PC:27019/todo?replicaSet=rs");
const app = express();
app.use(express.json({ limit: 2097152 }));
app.use("/static", express.static(__dirname + "/public"));
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri: "mongodb://Eli-PC/todo",
    collection: "sessions"
});
app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
    unset: "destroy",
    store,
    name: "cookie",
    cookie: {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: "auto",
        maxAge: 1000 * 60 * 60 * 24
    }
}));
const routes = require("./src/routes/routes");
routes.initializeUserRoutes(app);
routes.initializeListRoutes(app);
routes.initializeItemRoutes(app);
routes.initializeStaticRoutes(app);
const validation = require("./src/utils/validation");
app.use(
    (_, response) => validation.sendError(response, validation.Error.ResourceNotFound)
);
app.listen(8080, () => console.log("Node API server started"));
