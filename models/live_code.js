const mongoose = require("mongoose");

const liveCode = new mongoose.Schema(
  {
    joined_users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    live_creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    room_id: {
      type: String,
      required: [true, "room id is required"],
    },

    html: {
      type: String,
      default: "",
    },

    css: {
      type: String,
      default: "",
    },

    js: {
      type: String,
      default: "",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("liveCode", liveCode);
