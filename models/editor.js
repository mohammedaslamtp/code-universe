const mongoose = require("mongoose");

const editor = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: "Users",
      defulat:'guest'
    },
    theme: {
      type: String,
      default: "dracula",
    },
    tabSize: {
      type: Number,
      default: 4,
    },
    lineNumbers: {
      type: Boolean,
      default: true,
    },
    linerWrapping: {
      type: Boolean,
      default: true,
    },
    suggestions: {
      type: Boolean,
      defualt: false,
    },
    formatOnSave: {
      type: Boolean,
      default: true,
    },
    fontSize: {
      type: Number,
      default: 15,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("editor", editor);
