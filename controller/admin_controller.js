const bcrypt = require("bcrypt");
const admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

module.exports = {
  // admin login
  login: (req, res) => {
    try {
      let response = {};
      console.log(req.body);
      admin
        .findOne({ email: req.body.email })
        .then((data) => {
          bcrypt.compare(req.body.password, data.password, (err, resust) => {
            if (err) {
              // bcryption went somthing wrong
              console.log("bcryption went somthing wrong!! ", err);
            } else {
              if (resust) {
                console.log("data: ", data);
                let token = jwt.sign(
                  { email: data.email, password: data.password },
                  process.env.ACCESS_SECRET_TOKEN,
                  {
                    expiresIn: "24h",
                  }
                );
                console.log("admin confirmed");
                response.adminToken = token;
                res.status(200).json(response);
              } else {
                console.log("admin password is not valid");
                res.status(404).json("Incorrect email or password!");
              }
            }
          });
        })
        .catch((err) => {
          console.log("email not valid!");
          res.status(404).json("Incorrect email or password!");
        });
    } catch (e) {
      console.log("ERROR!! ", e);
    }
  },


  // get users data:
  getUsers: async (req, res) => {
    try {
      let Users = await users.find();
      console.log("Users: ", Users);
      res.status(200).json(Users);
    } catch (error) {
      console.log("USERS DATA ERROR!! ", error);
      res.status(404).json("server error!");
    }
  },

  // block user:
  blockUser: async (req, res) => {
    try {
      console.log(req.body.user_id);
      const id = req.body.user_id;
      const blocked_user = await users.findByIdAndUpdate(id, { is_spam: true });
      if (blocked_user) {
        console.log("blocked user: ", blocked_user);
        res.status(200).json(`${blocked_user.full_name} is blocked👍`);
      } else {
        res.status(404).json("user not found!");
      }
    } catch (error) {
      console.log("Block user ERROR:", error);
      res.status(404).json(error.message);
    }
  },

  // block user:
  unblockUser: async (req, res) => {
    try {
      console.log(req.body.user_id);
      id = req.body.user_id;
      const unblocked_user = await users.findByIdAndUpdate(id, {
        is_spam: false,
      });
      if (unblocked_user) {
        console.log("user unblocked: ", unblocked_user);
        res.status(200).json(`${unblocked_user.full_name} is unblocked now👍`);
      } else {
        res.status(404).json("data not found!");
      }
    } catch (error) {
      console.log("Unblock user ERROR:", error);
      res.status(404).json(error);
    }
  },
};
