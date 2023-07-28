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
      defualt:'no-creator'
    },

    room_id: {
      type: String,
      required: [true, "room id is required"],
    },

    html: {
      type: String,
      default: "<!-- write your html code here -->",
    },

    css: {
      type: String,
      default: "/* write your css code here */",
    },

    js: {
      type: String,
      default: "// write your js code here",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("liveCode", liveCode);
