const mongoose = require("mongoose");

const admin = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model("admin", admin);
