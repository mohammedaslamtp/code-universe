module.exports = {
    socketIo: (io, client) => {
      //socket connecting
      client.on("event", (data) => {
        console.log("socket id: ", client.id);
        console.log("socket connected", data);
      });
  
      //socket disconnecting
      client.on("disconnect", () => {
        console.log("socket disconnected");
      });
    },
  };
//   hello