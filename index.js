const express = require("express");
const path = require("path");
global.appRoot = path.resolve(__dirname);
const mongoose = require("mongoose");
mongoose.connect(process.argv[2] ?? "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/todo?replicaSet=rs")
        .then(mongoose => {
            if (process.argv[3]) {
                require("./dbinit").initializeDatabase(mongoose.connection.db);
            }
        });
mongoose.set("autoCreate", !process.argv[3]);
const app = express();
app.use(express.json({ limit: 2097152 }));
app.use("/static", express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "client/build")));
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
global.store = new MongoDBStore({
    uri: process.argv[2] ?? "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/todo?replicaSet=rs",
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
app.get(
    "*",
    (_, response) => response.sendFile(
        path.join(__dirname, process.argv[3] ? "client/build/index.html" : "client/public/index.html")
    )
);
require("./src/utils/schedule").scheduleTasks();
global.io = require("./src/utils/sockets").setupSockets(app.listen(8080, () => console.log("Node API server started")));
