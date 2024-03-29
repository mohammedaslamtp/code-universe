const Code = require("../models/code");
const crypto = require("crypto");
const LiveCode = require("../models/live_code");

module.exports = {
  // to render code page:
  runCode: async (req, res) => {
    try {
      const id = req.query.id;
      const template = await Code.findOne({ template_id: id });
      const html = template.html;
      const css = template.css;
      const js = template.js;
      const title = template.title;
      res.render("index", { html, css, js, title });
    } catch (error) {
      console.log("code page render error: ", error);
    }
  },

  // save code:
  saveCodeData: async (req, res) => {
    try {
      let randomId;
      if (req.body.random) {
        randomId = req.body.random;
      } else {
        randomId = crypto
          .randomBytes(Math.ceil(30 / 2))
          .toString("hex") // convert to hexadecimal format
          .slice(0, 30); // trim to desired length
      }
      const title = req.body.title;
      const html = req.body.html;
      const css = req.body.css;
      const js = req.body.js;
      let code;
      if (!req.body.random) {
        code = await Code.create({
          template_id: randomId,
          title: title,
          html: html,
          css: css,
          js: js,
          isGuest: true,
        });
      } else {
        code = await Code.findOneAndUpdate(
          { template_id: randomId },
          {
            $set: {
              template_id: randomId,
              title: title,
              html: html,
              css: css,
              js: js,
            },
          }
        );
      }
      res.status(200).json(code);
    } catch (error) {
      console.log("code snippet saving error! ", error);
    }
  },

  // store to as users template
  storeTemplate: async (req, res) => {
    try {
      const random = req.body.random;
      const title = req.body.title;
      const html = req.body.html;
      const css = req.body.css;
      const js = req.body.js;
      let user = req.user;

      if (random) {
        Code.findOneAndUpdate(
          { template_id: random },
          {
            $set: {
              user: user._id,
              template_id: random,
              title: title,
              html: html,
              css: css,
              js: js,
              isGuest: false,
            },
          }
        )
          .then((data) => {
            res.status(200).json({ saved: true, templateId: random });
          })
          .catch((err) => {
            res.status(404).json({ saved: false });
          });
      }
    } catch (error) {
      res.status(404).json({ saved: false });
    }
  },

  // remove unwanted code
  removeCode: (req, res) => {
    Code.findOneAndRemove({ template_id: req.query.random })
      .then(() => {
        console.log("successfully deleted");
      })
      .catch((err) => {
        console.log("code remove error: ", err);
      });
  },

  // get private codes
  getPrivateCodes: async (req, res) => {
    try {
      const privateCodes = await Code.find({
        $and: [{ isPrivate: true }, { user: req.query.id }],
      })
        .populate("user")
        .populate("like");
      res.status(200).json(privateCodes);
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },

  // get public codes
  getPublicCodes: async (req, res) => {
    try {
      const publicCodes = await Code.find({
        $and: [{ isPrivate: false }, { user: req.query.id }],
      })
        .populate("user")
        .populate("like");
      res.status(200).json(publicCodes);
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },
  // make it private
  makePrivate: (req, res) => {
    try {
      Code.findOneAndUpdate(
        { _id: req.query.id },
        {
          isPrivate: true,
        }
      )
        .then(() => {
          res.status(200).json({ isPrivate: true });
        })
        .catch((error) => {
          res.status(404).json({ isPrivate: true });
        });
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },

  // make it public
  makePublic: (req, res) => {
    try {
      Code.findByIdAndUpdate(req.query.id, {
        isPrivate: false,
      })
        .then(() => {
          res.status(200).json({ isPublic: true });
        })
        .catch((error) => {
          res.status(404).json({ isPublic: false });
        });
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },

  // delete code
  deleteCode: (req, res) => {
    try {
      Code.findByIdAndRemove(req.query.id)
        .then(() => {
          res.status(200).json({ isDeleted: true });
        })
        .catch((error) => {
          res.status(404).json({ isDeleted: false });
        });
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },

  // download code
  downloadCode: (req, res) => {
    try {
      const templateId = req.query.templateId;
      Code.findOne({ template_id: templateId })
        .then((data) => {
          res.status(200).json({ html: data.html, css: data.css, js: data.js });
        })
        .catch((error) => {
          res.status(404).json(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  },

  storeLiveCode: (req, res) => {
    const data = req.body;
    LiveCode.findOneAndUpdate(
      { room_id: data.room },
      { $set: { html: data.html, css: data.css, js: data.js } },
      { new: true }
    ).then((result) => {
      if (result) {
        res.status(200).json(result);
      }
    });
  },

  runLiveCode: (req, res) => {
    LiveCode.findOne({ room_id: req.query.room }).then((result) => {
      if (result) {
        res.render("live", {
          html: result.html,
          css: result.css,
          js: result.js,
        });
      }
    });
  },

  removeUnNeccessaryCode: (req, res) => {
    LiveCode.findOneAndDelete({ room_id: req.query.id }).then((result) => {
      console.log("deleted un-neccessary code");
    });
  },

  saveLiveCode: (req, res) => {
    const data = req.body;
    // if(data)
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    const randomId = crypto
      .randomBytes(Math.ceil(30 / 2))
      .toString("hex")
      .slice(0, 30);
    Code.create({
      template_id: randomId,
      user: req.user._id,
      html: data.html,
      css: data.css,
      js: data.js,
      title: randomNumber + "-live",
    })
      .then((val) => {
        res.status(200).json(val);
      })
      .catch((err) => {
        res.status(404).json(err.message);
      });
  },

  updateLiveCode: (req, res) => {
    const data = req.body;
    Code.findOneAndUpdate(
      { _id: data.id },
      {
        user: req.user._id,
        html: data.html,
        css: data.css,
        js: data.js,
      },
      { new: true }
    )
      .then((val) => {
        res.status(200).json(val);
      })
      .catch((err) => {
        res.status(404).json(err.message);
      });
  },
};
