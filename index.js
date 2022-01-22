const express = require("express");
const path = require("path");
global.appRoot = path.resolve(__dirname);
require("mongoose").connect("mongodb://localhost:27017,localhost:27018,localhost:27019/todo?replicaSet=rs");
const app = express();
app.use(express.json({ limit: 2097152 }));
app.use("/static", express.static(__dirname + "/public"));
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
const server = app.listen(8080, () => console.log("Node API server started"));

// socket.io + node-schedule
const io = require('socket.io')(server);
const schedule = require('node-schedule');

io.on('connection', (socket) =>  {
    console.log('a user connected');

    socket.on('reminder', (data) => {
        console.log('Reminder set for ' + data);
        schedule.scheduleJob(data, function(){
            console.log('Trigger reminder');
            socket.emit('reminder');
        });
    });

    socket.on("message", data => {  console.log("RECEIVED THIS MSG: " + data);});

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


