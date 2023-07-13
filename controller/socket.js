const LiveCode = require("../models/live_code");
const Users = require("../models/users");

module.exports = {
  socketIo: (io) => {
    let connectedClients = [];
    let creator = {};
    try {
      //socket connecting
      io.on("connection", (client) => {
        console.log("connected****** ", client.id);
        client.emit("roomId", client.id);``

        // Join the specified room
        client.on("joinRoom", (join) => {
          client.join(join.roomId);
          client.room = "room*1";
          Users.findById(join.userId).then((user) => {
            if (join.isCreator) {
              creator = user;
            } else {
              console.log("users ", connectedClients);
              connectedClients.push(user);
            }
          });
          console.log(`User joined in room: ${join.roomId}`);
          const roomUsers = io.sockets.adapter.rooms.get(join.roomId);
          console.log("Joined users****:", roomUsers);
        });

        // Leave the specified room
        client.on("leaveRoom", (leave) => {
          client.leave(leave.roomId);
          console.log(`User left room ${leave.roomId}`);
          if (leave.isCreator) {
            connectedClients = [];
          } else {
            connectedClients = connectedClients.filter(
              (el) => el.id !== leave.userId
            );
          }
        });

        //socket disconnecting
        client.on("disconnect", () => {
          console.log("socket disconnected");
        });
      });
    } catch (error) {
      console.log("socket error: ", error);
    }
  },
};
