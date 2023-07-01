const multer = require("multer");
const User = require("../models/users");

const apiRes = {
  message: "Authentication success",
  authorization: true,
  status: 401,
  data: {},
};
module.exports = {
  // to update profile image
  updateProfile: (req, res) => {
    try {
      res.locals.upload(req, res, (err) => {
        if (err) {
          apiRes.message = err;
          res.status(404).json(apiRes);
        } else {
          if (req.file == undefined) {
            apiRes.message = "You haven't selected any images!";
            apiRes.status = 400;
            res.status(404).json(apiRes);
          } else {
            User.findByIdAndUpdate(
              req.user._id,
              { avatar: req.file.path.slice(7) },
              { new: true }
            )
              .then((result) => {
                apiRes.message = "Profile updated";
                apiRes.status = 200;
                apiRes.data = {
                  fileName: result.avatar,
                };
                res.status(200).json(apiRes);
              })
              .catch((err) => {
                apiRes.message = "Oops! Something went wrong!";
                apiRes.status = 404;
                res.status(404).json(apiRes);
              });
          }
        }
      });
    } catch (error) {
      apiRes.message = "Oops! Something went wrong!";
      apiRes.status = 404;
      res.status(404).json(apiRes);
    }
  },

  // to remove profile image
  removeProfileImage: (req, res) => {
    User.findByIdAndUpdate(req.user._id, { avatar: null }, { new: true })
      .then((data) => {
        apiRes.data = data;
        apiRes.status = 200;
        apiRes.message = "Profile image removed";
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        apiRes.message = "Oops! Something went wrong!";
        apiRes.data = null;
        apiRes.status = 404;
        res.status(404).json(apiRes);
      });
  },

  // to update user profile data
  updateAbout: (req, res) => {
    console.log('data for update: ',req.body)
    const urlData = req.body.urlData;
    const aboutData = req.body.aboutData;
   
    User.findByIdAndUpdate(
      req.user._id,
      {
        display_name: aboutData.displayName,
        location: aboutData.location,
        bio: aboutData.bio,
        linkedin_link: urlData.linkedInUrl,
        twitter_link: urlData.twitterUrl,
      },
      { new: true }
    )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Updated successfully";
        res.status(200).json(apiRes);
      })
      .catch((err) => {
        apiRes.status = 404;
        apiRes.data = null;
        apiRes.message = "Oops! Something went wrong!";
        res.status(404).json(apiRes);
      });
  },

  // checking is username unique or not
  isUsernameUnique: (req, res) => {
    const username = req.query.username;
    User.findOne({ full_name: username })
      .then((user) => {
        apiRes.status = 200;
        if (user != null || user != undefined) {
          apiRes.message = "This username is unavailable!";
          apiRes.data = { unique: false };
        } else {
          apiRes.message = "username is unique";
          apiRes.data = { unique: true };
        }
        res.status(200).json(apiRes);
      })
      .catch((err) => {
        apiRes.status = 404;
        apiRes.message = "Oops! Something went wrong!";
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // change username
  changeUsername: (req, res) => {
    const username = req.query.username;
    User.findByIdAndUpdate(req.user._id, { full_name: username }, { new: true })
      .then((user) => {
        apiRes.status = 200;
        apiRes.message = "updated successfully";
        apiRes.data = { username: user.full_name };
        res.status(200).json(apiRes);
      })
      .catch((err) => {
        apiRes.status = 404;
        apiRes.message = "Oops! Something went wrong!";
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },
};
