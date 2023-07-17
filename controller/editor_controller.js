const editor = require("../models/editor");

const apiRes = {
  message: "Authentication success",
  authorization: true,
  status: 401,
  data: {},
};

module.exports = {
  // to get editor details
  getEditorDetails: (req, res) => {
    editor
      .findOne({ user: req.query.id })
      .then((data) => {
        apiRes.status = 200;
        apiRes.message = "Success";
        apiRes.data = data;
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.data = {};
        apiRes.message = "Something went wrong!";
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to change editor themes
  changeTheme: (req, res) => {
    const theme = req.body.theme;
    editor
      .findOneAndUpdate({ user: req.user._id }, { theme: theme }, { new: true })
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Theme updated successfully";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to change font size
  changeFontSize: (req, res) => {
    const size = req.body.fontSize;
    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { fontSize: size },
        { new: true }
      )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Font size changed";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to change tab size
  changetabSize: (req, res) => {
    const size = req.body.tabSize;
    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { tabSize: size },
        { new: true }
      )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Tab size changed";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },
};
