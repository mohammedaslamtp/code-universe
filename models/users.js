const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
    },

    display_name: {
      type: String,
      required: [true, "Display name is required"],
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: 8,
    },

    phone: {
      type: Number,
    },

    pinned_items: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "templates",
    },

    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    avatar: {
      type: String,
      defulat: null,
    },

    bio: {
      type: String,
    },

    location: {
      type: String,
    },

    is_spam: {
      type: Boolean,
      default: false,
    },

    is_disabled: {
      type: Boolean,
      default: false,
    },

    linkedin_link: {
      type: String,
    },

    twitter_link: {
      type: String,
    },

    otp_verified: {
      type: Boolean,
      defualt: false,
    },

    user_otp: {
      otp: {
        type: Number,
        default: 00,
      },
      isGenerated: { type: Boolean, default: false },
      beginsIn: { type: Date, default: new Date() },
      expiresIn: { type: Date, default: new Date() },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", user);
