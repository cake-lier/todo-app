"use strict";

const List = require("../model/listModel").createListModel();

function setupSockets(server) {
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        socket.on("join", (joinCode, username, completionCallback) => {
            List.findOne({ joinCode })
                .exec()
                .then(
                    list => {
                        if (list === null) {
                            completionCallback({ success: false });
                        } else {
                            const listId = list._id.toString();
                            io.in(`list:${ listId }:owner`)
                              .fetchSockets()
                              .then(sockets => {
                                  if (sockets.length === 0) {
                                      completionCallback({
                                          success: true,
                                          listId: null
                                      });
                                      return;
                                  }
                                  sockets.forEach(
                                      socket => socket.emit("joinRequest", list.title, socket.id, username, result => {
                                          if (result.isApproved) {
                                              completionCallback({
                                                  success: true,
                                                  listId
                                              });
                                              return;
                                          }
                                          completionCallback({
                                              success: true,
                                              listId: null
                                          });
                                      })
                                  )
                              });
                        }
                    },
                    error => {
                        console.log(error);
                        completionCallback({ success: false });
                    }
                );
        });
    });
    return io;
}

module.exports = {
    setupSockets
}
