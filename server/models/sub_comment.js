const mongoose = require("mongoose");

const subComment = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
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

    subCommentOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      required: [true, "Id of parent comment is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subComment", subComment);
