const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    tempId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "code",
    },

    dateAndTime: {
      type: Date,
      required: [true, "comment time is required"],
    },

    commentText: {
      type: String,
      required: [true, "comment text is required"],
    },

    like: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    subComment: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "subComment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", comment);
