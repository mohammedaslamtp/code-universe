const LiveCode = require("../models/live_code");
const Users = require("../models/users");

module.exports = {
  socketIo: (io, client) => {
    let connectedClients = [];
    try {
      //socket connecting
      client.on("event", (data) => {
        console.log("socket room id: ", client.id);
        console.log("recived ", data);
        client.emit("roomId", client.id);
      });

      // joining to room
      client.on("client", (clientId) => {
        Users.findById(clientId)
          .then((userData) => {
            connectedClients.push(userData);
            client.emit("connectedClients", connectedClients);
            console.log("connectedClients: ", connectedClients);
          })
          .catch((e) => {
            console.log("user not valid error: ", e);
          });
      });

      //socket disconnecting
      client.on("disconnect", () => {
        console.log("socket disconnected");
      });
    } catch (error) {
      console.log("socket error: ", error);
    }
  },
};
