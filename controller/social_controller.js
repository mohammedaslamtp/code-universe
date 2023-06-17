const User = require("../models/users");
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
};
