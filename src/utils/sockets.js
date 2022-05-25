"use strict";

const _ = require("lodash");
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
                                  const pendingRequest = {};
                                  pendingRequest[socketId] = sockets.map(s => s.id);
                                  requests[listId] = Object.assign(pendingRequest, requests[listId]);
                                  completionCallback({
                                      error: false,
                                      sent: true
                                  });
                                  sockets.forEach(s => s.emit("joinRequest", listId, list.title, username, socketId));
                              });
                        }
                    },
                    error => {
                        console.log(error);
                        completionCallback({ error: true });
                    }
                );
        });
        socket.on("joinApproval", (socketId, listId, anonymousSocketId, isApproved, anonymousId) => {
            if (requests?.[listId]?.[anonymousSocketId]?.includes(socketId)) {
                delete requests[listId][anonymousSocketId];
                if (_.isEmpty(requests[listId])) {
                    delete requests[listId];
                }
                io.in(anonymousSocketId).emit("joinResponse", isApproved ? listId : null, anonymousId);
            }
        });
    });
    return io;
}

module.exports = {
    setupSockets
}
