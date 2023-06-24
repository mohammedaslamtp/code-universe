const multer = require("multer");
const User = require("../models/users");

const apiRes = {
  message: "Authentication Failed!",
  authorization: true,
  status: 401,
  data: {},
};
module.exports = {
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
};
