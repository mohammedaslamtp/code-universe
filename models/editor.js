const mongoose = require("mongoose");

const editor = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: "Users",
      defulat: "guest",
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
    suggestion: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: (value) =>
          typeof value === "object" || typeof value === "boolean", // feild type should be a boolean or a object
        message: "Field must be an object or a boolean", // passing msg if detected any other types
      },
      defualt: { "Ctrl-Space": "autocomplete" },
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
