"use strict";

const List = require("../model/listModel").createListModel();
const requests = {};

function setupSockets(server) {
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        socket.on("join", (joinCode, username, socketId, completionCallback) => {
            List.findOne({ joinCode })
                .exec()
                .then(
                    list => {
                        if (list === null) {
                            completionCallback({ error: true });
                        } else {
                            const listId = list._id.toString();
                            io.in(`list:${ listId }:owner`)
                              .fetchSockets()
                              .then(sockets => {
                                  if (sockets.length === 0) {
                                      completionCallback({
                                          error: false,
                                          sent: false
                                      });
                                      return;
                                  }
                                  requests[listId] = { anonymousSocket: socketId, ownerSockets: sockets.map(s => s.id) };
                                  completionCallback({
                                      error: false,
                                      sent: true
                                  });
                                  sockets.forEach(s => s.emit("joinRequest", listId, list.title, username));
                              });
                        }
                    },
                    error => {
                        console.log(error);
                        completionCallback({ success: false });
                    }
                );
        });
        socket.on("joinApproval", (socketId, listId, isApproved) => {
            const data = requests[listId];
            if (data && data.ownerSockets.includes(socketId)) {
                delete requests[listId];
                io.in(data.anonymousSocket).emit("joinResponse", isApproved ? listId : null);
            }
        });
    });
    return io;
}

module.exports = {
    setupSockets
}
