const mongoose = require("mongoose");

const code = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    title: {
      type: String,
      required: [true, "title is required for a code template"],
    },

    template_id: {
      type: String,
      required: [true, "unique template id is required"],
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

    isGuest: {
      type: Boolean,
      default: false,
    },

    comment: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comment",
    },

    like: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },
    views: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    upVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    downVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("code", code);
