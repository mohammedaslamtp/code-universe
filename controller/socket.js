const LiveCode = require("../models/live_code");
const Users = require("../models/users");
const crypto = require("crypto");

module.exports = {
  socketIo: (io) => {
    let connectedClients = [];
    let creator = {};
    let roomId = "";
    try {
      //socket connecting
      io.on("connection", (client) => {
        client.on("connectionData", (data) => {
          roomId = hashString(data);
          client.emit("roomId", roomId);
        });

        // Join the specified room
        client.on("joinRoom", (join) => {
          let isUserExist = false;
          client.join(join.roomId);
          Users.findById(join.userId).then((user) => {
            if (join.isCreator) {
              creator = user;
              client.emit("connectedClients", connectedClients);
            } else {
              isUserExist = connectedClients.forEach(
                (el) => !!el._id === user._id
              );
              if (!isUserExist) connectedClients.push(user);
              client.emit("connectedClients", connectedClients);
              client.to(roomId).emit("connectedClients", connectedClients);
            }
          });
        });

        // passing data
        client.on("data", (data) => {
          let code = data;
          console.log("data: ", code);
          console.log("roomid: ", roomId);
          client.to(roomId).emit("code", code);
        });

        // Leave the specified room
        client.on("leaveRoom", (leave) => {
          client.leave(leave.roomId);
          if (leave.isCreator) {
            connectedClients = [];
            client.emit("connectedClients", connectedClients);
          } else {
            connectedClients = connectedClients.filter(
              (el) => el.id !== leave.userId
            );
            client.emit("connectedClients", connectedClients);
          }
        });

        //socket disconnecting
        client.on("disconnect", () => {
          connectedClients = [];
          client.emit("connectedClients", connectedClients);
          console.log("socket disconnected");
        });
      });
    } catch (error) {
      console.log("socket error: ", error);
    }
  },
};

const hashString = (input) => {
  // Create a SHA-256 hash object
  const hash = crypto.createHash("sha256");
  // Update the hash object with the input string
  hash.update(input);
  // Get the hashed output in hexadecimal format
  const hashedString = hash.digest("hex");
  console.log(hashedString);
  return hashedString;
};
