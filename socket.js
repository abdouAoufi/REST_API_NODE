let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw Error("Socket io not found");
    }
    return io;
  },
};


// we want this file whenver we use socket connection
