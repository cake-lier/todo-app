const express = require("express");
const path = require("path");
global.appRoot = path.resolve(__dirname);
require("mongoose").connect("mongodb://localhost:27017,localhost:27018,localhost:27019/todo?replicaSet=rs");
const app = express();
app.use(express.json({ limit: 2097152 }));
app.use("/static", express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "client/build")));
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri: "mongodb://localhost/todo",
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
        secure: "auto"
    }
}));
const routes = require("./src/routes/routes");
routes.initializeUserRoutes(app);
routes.initializeListRoutes(app);
routes.initializeItemRoutes(app);
routes.initializeStaticRoutes(app);
const { sendError, Error } = require("./src/utils/validation");
app.use(
    (_, response) => sendError(response, Error.ResourceNotFound)
);
const schedule = require("node-schedule");
global.io = require("./src/controller/sockets").setupSockets(app.listen(8080, () => console.log("Node API server started")));
