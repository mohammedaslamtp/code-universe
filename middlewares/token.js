const jwt = require("jsonwebtoken");
const Users = require("../models/users");

function authenticateToken(req, res, next) {
  let response = {};
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("token null...");
    return res.json("401");
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, data) => {
    if (err) {
      console.log("jwr middleware error ", err);
      response.error = err.message;
      if (err.expiredAt) {
        response.expiredAt = err.expiredAt;
      }
      return res.status(404).json(response);
    } else {
      console.log("data from jwt: ", data);
      let userData = await Users.findOne({ email: data.email });
      console.log("jwt user. database: ", userData);
      req.user = userData;
    }
    next();
  });
}

module.exports = { authenticate: authenticateToken };
