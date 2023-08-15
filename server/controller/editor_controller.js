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

  // to adjust line number option
  adjustLineNumber: (req, res) => {
    let lineNumber = req.body.lineNumber;

    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { lineNumbers: lineNumber },
        { new: true }
      )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Updated successfully";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to adjust line wrapping option
  adjustLineWrapping: (req, res) => {
    let linerWrapping = req.body.LineWrapping;
    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { linerWrapping: linerWrapping },
        { new: true }
      )
      .then((data) => {
        console.log("res ", data);
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Updated successfully";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to adjust editor suggestions
  editorSuggestions: (req, res) => {
    let isSuggest = req.body.suggestion;
    if (req.body.suggestion) {
      isSuggest = { "Ctrl-Space": "autocomplete" };
    } else {
      isSuggest = false;
    }

    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { suggestion: isSuggest },
        { new: true }
      )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Updated successfully";
        res.status(apiRes.status).json(apiRes);
      })
      .catch((e) => {
        apiRes.status = 404;
        apiRes.message = "Something went wrong!";
        apiRes.data = {};
        res.status(apiRes.status).json(apiRes);
      });
  },

  // to adjust format option on save
  formatOnSave: (req, res) => {
    let formatOnSave = req.body.formatOnSave;
    editor
      .findOneAndUpdate(
        { user: req.user._id },
        { formatOnSave: formatOnSave },
        { new: true }
      )
      .then((data) => {
        apiRes.status = 200;
        apiRes.data = data;
        apiRes.message = "Updated successfully";
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
