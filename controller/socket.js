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
        let liveCreator;
        client.on("connectionData", (data) => {
          roomId = hashString(data);
          LiveCode.create({ room_id: roomId })
            .then((val) => {
              if (val) client.emit("roomId", val.room_id);
            })
            .catch((error) => {
              if (error) client.emit("creationError", "Something went wrong!");
            });
        });

        // re-checking is valid roomId or not
        client.on("isRoomExist", (room) => {
          LiveCode.findOne({ room_id: room })
            .populate("joined_users")
            .then((res) => {
              if (res) {
                roomId = res.room_id;
                client.emit("validRoom", true);
              } else {
                client.emit("validRoom", false);
                client.emit("room-not-found", "Live dosen't exist!");
              }
            });
        });

        // creator joining
        client.on("createRoom", (create) => {
          LiveCode.findOneAndUpdate(
            { room_id: create.roomId },
            {
              live_creator: create.userId,
              $addToSet: { joined_users: create.userId },
            },
            { new: true }
          )
            .populate("joined_users")
            .then((res) => {
              if (res) {
                roomId = res.room_id;
                client.join(create.roomId);
                connectedClients = res.joined_users;
                liveCreator = res.live_creator;
                client.to(res.room_id).emit("connectedClients", {
                  connectedClients: connectedClients,
                  liveCreator: liveCreator,
                });
                client.emit("connectedClients", {
                  connectedClients: connectedClients,
                  liveCreator: liveCreator,
                });
              }
            });
        });

        // members joining
        client.on("joinRoom", (join) => {
          LiveCode.findOneAndUpdate(
            { room_id: join.roomId },
            { $addToSet: { joined_users: join.userId } },
            { new: true }
          )
            .populate("joined_users")
            .then((res) => {
              if (res) {
                roomId = res.room_id;
                client.join(res.room_id);
                connectedClients = res.joined_users;
                liveCreator = res.live_creator;
                client.to(res.room_id).emit("connectedClients", {
                  connectedClients: connectedClients,
                  liveCreator: liveCreator,
                });
                client.emit("connectedClients", {
                  connectedClients: connectedClients,
                  liveCreator: liveCreator,
                });
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
          // removing room if creator leaves
          if (leave.userId == liveCreator) {
            LiveCode.deleteOne({ room_id: leave.roomId }).then((res) => {
              client.to(leave.roomId).emit("liveEnd", "Live end");
              liveCreator = null;
            });
          } else {
            LiveCode.findOneAndUpdate(
              { room_id: leave.roomId },
              { $pull: { joined_users: leave.userId } },
              { new: true }
            )
              .populate("joined_users")
              .then((res) => {
                if (res) {
                  roomId = res.room_id;
                  client.leave(leave.roomId);
                  connectedClients = res.joined_users;
                  liveCreator = res.live_creator;
                  client.to(res.room_id).emit("connectedClients", {
                    connectedClients: connectedClients,
                    liveCreator: liveCreator,
                  });
                }
              });
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

const hashString = (input) => {
  // generating random number first
  const min = 100000; // Minimum 6-digit number (inclusive)
  const max = 999999; // Maximum 6-digit number (inclusive)
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  // Create a SHA-256 hash object
  const hash = crypto.createHash("sha256");
  // Update the hash object with the input string
  hash.update(input);
  // Get the hashed output in hexadecimal format
  const hashedString = hash.digest("hex");
  return hashedString + randomNum;
};
