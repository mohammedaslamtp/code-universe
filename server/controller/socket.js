const LiveCode = require("../models/live_code");
const crypto = require("crypto");
const Code = require("../models/code");

// comment
const Comment = require("../models/comment");
const SubComment = require("../models/sub_comment");

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
                // initial html emit
                client.emit("initialHtmlEmit", htmlCodePart);
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
                // initial html emit
                client.emit("initialHtmlEmit", htmlCodePart);
              } else {
                client.emit("validRoom", false);
                client.emit("room-not-found", "Live dosen't exist!");
              }
            });
        });

        // need to modify...working on it..
        // passing data
        client.on("html", (data) => {
          client.to(roomId).emit("htmlCode", data);
        });

        // if pressing backspace
        client.on("Backspace", (data) => {
          client.to(roomId).emit("backspacePress", data);
        });

        // if pressing control + backspace
        client.on("ctrlAndBackspace", (data) => {
          client.to(roomId).emit("ctrlBackspacePress", data);
        });

        // if pressing Enter (add new line)
        client.on("addNewLine", (data) => {
          client.to(roomId).emit("newLine", data.line);
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

        // not related to the live coding
        // adding comments(reactions) for templates
        let commentRoomId = "";
        // join comment room
        client.on("joinCommentRoom", (id) => {
          commentRoomId = id;
          client.join(id);
        });

        // adding comments
        client.on("addComment", (data) => {
          const commentDetails = data;
          Comment.create({
            commentText: commentDetails.comment,
            dateAndTime: Date.now(),
            user: commentDetails.userId,
            tempId: commentDetails.tempId,
          })
            .then((res) => {
              Code.findOneAndUpdate(
                { _id: commentDetails.tempId },
                { $addToSet: { comment: res._id } }
              ).then((val) => {
                fetchComments(val._id);
              });
            })
            .catch((e) => {
              console.log("something went wrong! ", e);
            });
        });

        // adding sub comments or replay comments
        client.on("addSubComment", (data) => {
          const commentDetails = data;
          SubComment.create({
            commentText: commentDetails.comment,
            dateAndTime: Date.now(),
            user: commentDetails.userId,
            subCommentOf: commentDetails.parentId,
          })
            .then((res) => {
              console.log("sub comment added: ", res);
              Comment.findOneAndUpdate(
                { _id: commentDetails.parentId },
                { $addToSet: { subComment: res._id } }
              ).then((val) => {
                fetchComments(data.tempId);
              });
            })
            .catch((e) => {
              console.log("something went wrong! ", e);
            });
        });

        // like and remove like of comments
        client.on("adjustLike", (query) => {
          if (query.isChild) {
            SubComment.findById(query.id).then((val) => {
              const index = val.like.indexOf(query.userId);
              if (index !== -1) {
                val.like.splice(index, 1);
              } else {
                val.like.push(query.userId);
              }
              val.save().then((res) => {
                client.emit("likeCountUpdated", {
                  fullDetails: res,
                  isChild: true,
                });
                client.to(commentRoomId).emit("likeCountUpdated", {
                  fullDetails: res,
                  isChild: true,
                });
              });
            });
          } else {
            Comment.findById(query.id).then((val) => {
              const index = val.like.indexOf(query.userId);
              if (index !== -1) {
                val.like.splice(index, 1);
              } else {
                val.like.push(query.userId);
              }
              val.save().then((res) => {
                client.emit("likeCountUpdated", {
                  fullDetails: res,
                  isChild: false,
                });
                client.to(commentRoomId).emit("likeCountUpdated", {
                  fullDetails: res,
                  isChild: false,
                });
              });
            });
          }
        });

        // emitting comments
        client.on("giveAllComments", (query) => {
          fetchComments(query.id);
        });

        // delete comments
        client.on("deleteComment", (query) => {
          if (query.isChild == true) {
            SubComment.findByIdAndRemove(query.id, { new: true }).then(
              (comm) => {
                Comment.findByIdAndUpdate(
                  query.parentId,
                  {
                    $pull: { subComment: query.id },
                  },
                  { new: true }
                ).then((data) => {
                  fetchComments(data.tempId);
                });
              }
            );
          } else {
            SubComment.deleteMany({ subCommentOf: query.id }).then((comm) => {
              Comment.findByIdAndRemove(query.id).then((res) => {
                Code.findOneAndUpdate(
                  { _id: res.tempId },
                  { $pull: { comment: query.id } }
                ).then((val) => {
                  fetchComments(res.tempId);
                });
              });
            });
          }
        });

        // leave from comment room
        client.on("leaveCommentRoom", (id) => {
          client.leave(id);
        });

        function fetchComments(id) {
          Comment.find({ tempId: id })
            .populate("user")
            .populate("subComment")
            .populate({
              path: "subComment",
              populate: { path: "user", model: "Users" },
            })
            .then((val) => {
              client.emit("allComments", val);
              client.to(commentRoomId).emit("allComments", val);
            });
        }

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
