const User = require("../models/users");
const Template = require("../models/code");
const Comments = require("../models/comment");

const apiRes = {
  message: "Authentication success",
  authorization: true,
  status: 401,
  data: {},
};

module.exports = {
  follow: async (req, res) => {
    try {
      const userId = req.query.id;
      const ownerId = req.user._id;

      const userData = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { followers: ownerId } },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: ownerId },
        { $addToSet: { following: userId } },
        { new: true }
      );
      res.status(200).json(userData);
    } catch (e) {
      res.status(404).json(e);
    }
  },

  unFollow: async (req, res) => {
    try {
      const userId = req.query.id;
      const ownerId = req.user._id;

      const userData = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { followers: ownerId } },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: ownerId },
        { $pull: { following: userId } },
        { new: true }
      );
      res.status(200).json(userData);
    } catch (e) {
      res.status(404).json(e);
    }
  },

  like: (req, res) => {
    const id = req.query.id;
    console.log(id);
    Template.findByIdAndUpdate(
      id,
      { $addToSet: { like: req.user._id } },
      { new: true }
    )
      .populate("like")
      .populate("user")
      .then((data) => {
        apiRes.data = data;
        apiRes.status = 200;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.data = e.message;
        apiRes.status = 404;
        res.status(404).json(apiRes);
      });
  },

  disLike: (req, res) => {
    const id = req.query.id;
    Template.findOneAndUpdate(
      { _id: id },
      { $pull: { like: req.user._id } },
      { new: true }
    )
      .populate("user")
      .populate("like")
      .then((data) => {
        apiRes.data = data;
        apiRes.status = 200;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.data = e.message;
        apiRes.status = 404;
        res.status(404).json(apiRes);
      });
  },

  allComments: (req, res) => {
    Comments.find({ tempId: req.query.id })
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data.length;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        console.log("something went wrong!");
      });
  },

  likedUsers: (req, res) => {
    Template.findById(req.query.id)
      .populate("like")
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data.like;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        console.log("something went wrong!");
      });
  },

  // add a item to the pin list
  addToPin: (req, res) => {
    const userId = req.user._id;
    const tempId = req.body.id;
    User.findByIdAndUpdate(userId, {
      $addToSet: { pinned_items: tempId },
    })
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // remove an item from the list
  removeFromPin: (req, res) => {
    const userId = req.user._id;
    const tempId = req.query.id;
    User.findByIdAndUpdate(userId, {
      $pull: { pinned_items: tempId },
    })
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // to get all following users
  getAllFollowingUsers: (req, res) => {
    let allData = [];
    User.findById(req.query.id)
      .populate("following")
      .then((data) => {
        allData = data.following;
        apiRes.status = 200;
        apiRes.data = allData;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },
  // to get all followers
  getAllFollowers: (req, res) => {
    let allData = [];
    User.findById(req.query.id)
      .populate("followers")
      .then((data) => {
        allData = data.followers;
        apiRes.status = 200;
        apiRes.data = allData;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // add rating to users
  upVote: (req, res) => {
    const userId = req.user._id;
    const tempId = req.query.id;
    Template.findOneAndUpdate(
      { _id: tempId },
      { $addToSet: { upVote: userId }, $pull: { downVote: userId } },
      { new: true }
    ).then((val) => {
      const rating = val.upVote.length - val.downVote.length;
      apiRes.status = 200;
      apiRes.data = { rating: rating };
      res.status(200).json(apiRes);
    });
  },

  downVote: (req, res) => {
    const userId = req.user._id;
    const tempId = req.query.id;
    Template.findOneAndUpdate(
      { _id: tempId },
      { $addToSet: { downVote: userId }, $pull: { upVote: userId } },
      { new: true }
    ).then((val) => {
      const rating = val.upVote.length - val.downVote.length;
      apiRes.status = 200;
      apiRes.data = { rating: rating };
      res.status(200).json(apiRes);
    });
  },

  // to fetch all pinned items
  allPinnedItems: (req, res) => {
    User.findById(req.user._id)
      .populate({
        path: "pinned_items",
        model: "code", // Specify the model for "pinned_items"
        populate: {
          path: "user", // Populate the "user" field within "pinned_items"
          model: "Users", // Specify the model for "user"
        },
      })
      .then((user) => {
        apiRes.status = 200;
        apiRes.data = user.pinned_items;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        console.log(e);
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // pin a code template
  pinItem: () => {
    const tempId = req.query.id;
    User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { pinned_items: tempId } },
      { new: true }
    )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data.pinned_items;
        res.status(200).json(apiRes);
      })
      .catch((error) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // un-pin a code template
  unPinItem: () => {
    const tempId = req.query.id;
    User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { pinned_items: tempId } },
      { new: true }
    )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data.pinned_items;
        res.status(200).json(apiRes);
      })
      .catch((error) => {
        apiRes.status = 404;
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },
};
