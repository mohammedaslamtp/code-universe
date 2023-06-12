const jwt = require("jsonwebtoken");
const Users = require("../models/users");

function authenticateToken(req, res, next) {
  let response = {};
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json("401");
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, data) => {
    if (err) {
      response.error = err.message;
      if (err.expiredAt) {
        response.expiredAt = err.expiredAt;
      }
      return res.status(401).json(response);
    } else {
      let userData = await Users.findOne({ email: data.email });
      req.user = userData;
    }
    next();
  });
}

module.exports = { authenticate: authenticateToken };
