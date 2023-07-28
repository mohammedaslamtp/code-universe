const LiveCode = require("../models/live_code");
const crypto = require("crypto");
const Diff = require("diff");

module.exports = {
  socketIo: (io) => {
    try {
      //socket connecting
      io.on("connection", (client) => {
        console.log("socket connected");
        let roomId = "";
        let htmlCodePart = "<!-- write your html code here -->";
        let connectedClients = [];
        client.on("connectionData", (data) => {
          roomId = hashString(data);
          LiveCode.create({ room_id: roomId })
            .then((val) => {
              client.emit("roomId", val.room_id);
            })
            .catch((error) => {
              client.emit("creationError", "Something went wrong!");
            });
        });

        // re-checking is valid roomId or not
        client.on("isRoomExist", (room) => {
          console.log("room for checking.. ", room);
          LiveCode.findOne({ room_id: room }).then((res) => {
            if (res) {
              console.log("found room");
              client.emit("validRoom", true);
            } else {
              console.log("not-found room");
              client.emit("validRoom", false);
              client.emit("room-not-found", "Live dosen't exist!");
            }
          });
        });

        // creator joining
        client.on("createRoom", (create) => {
          LiveCode.findOneAndUpdate(
            { room_id: create.roomId },
            { $set: { live_creator: create.userId } }
          ).then((res) => {
            if (res) {
              client.join(create.roomId);
              connectedClients = res.joined_users;
              console.log(
                "connected clients in createRoom : ",
                connectedClients
              );
            }
          });
        });

        // members joining
        client.on("joinRoom", (join) => {
          LiveCode.findOneAndUpdate(
            { room_id: join.roomId },
            { $addToSet: { joined_users: join.userId } },
            { new: true }
          ).then((res) => {
            if (res) {
              roomId = res.room_id;
              client.join(res.room_id);
            } else {
              client.emit("validRoom", false);
              client.emit("room-not-found", "Live dosen't exist!");
            }
          });
        });

        // need to modify...working on it..
        // passing data
        client.on("data", (data) => {
          const changes = Diff.diffChars(htmlCodePart, data);
          console.log("diff changes: ", changes);
          htmlCodePart = data;
          console.log("data: ", htmlCodePart);
          client.to(roomId).emit("code", htmlCodePart);
        });

        // Leave the specified room
        client.on("leaveRoom", (leave) => {
          client.leave(leave.roomId);
          if (leave.isCreator) {
            client.to(roomId).emit("connectedClients", connectedClients);
          } else {
            connectedClients = connectedClients.filter(
              (el) => el.id !== leave.userId
            );
            client.to(roomId).emit("connectedClients", connectedClients);
          }
        });

        //socket disconnecting
        client.on("disconnect", () => {
          connectedClients = [];
          client.to(roomId).emit("connectedClients", connectedClients);
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
