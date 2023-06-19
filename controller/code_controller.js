const Code = require("../models/code");
const User = require("../models/users");
const crypto = require("crypto");

module.exports = {
  // to render code page:
  runCode: async (req, res) => {
    try {
      console.log("id ", req.query.id);
      let id = req.query.id;
      let template = await Code.findOne({ template_id: id });
      let html = template.html;
      let css = template.css;
      let js = template.js;
      res.render("index", { html, css, js });
    } catch (error) {
      console.log("code page render error: ", error);
    }
  },

  // save code:
  saveCodeData: async (req, res) => {
    try {
      let randomId;
      console.log(req.body);
      if (req.body.random) {
        randomId = req.body.random;
      } else {
        randomId = crypto
          .randomBytes(Math.ceil(30 / 2))
          .toString("hex") // convert to hexadecimal format
          .slice(0, 30); // trim to desired length
      }
      let title = req.body.title;
      let html = req.body.html;
      let css = req.body.css;
      let js = req.body.js;
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
      console.log(code, " saved");
      res.status(200).json(code);
    } catch (error) {
      console.log("code snippet saving error! ", error);
    }
  },

  // store to as users template
  storeTemplate: async (req, res) => {
    try {
      console.log("uzzer: ", req.user);
      console.log("body: ", req.body);
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
            console.log("code save success: ", data);
            res.status(200).json({ saved: true });
          })
          .catch((err) => {
            console.log("error: ", err);
            res.status(404).json({ saved: false });
          });
      }
    } catch (error) {
      console.log("code store error: ", error);
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
      }).populate("user");
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
      }).populate("user");
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
          console.log("updated to private faild: ", error);
        });
    } catch (error) {
      console.log("ERROR!! ", error);
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
          console.log("updated to public faild: ", error);
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
          console.log("deletion code is faild: ", error);
          res.status(404).json({ isDeleted: false });
        });
    } catch (error) {
      res.status(404).json(error.reason);
    }
  },
};
