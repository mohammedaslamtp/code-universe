const express = require("express");
const route = express.Router();
const admin = require("../controller/admin_controller");

route
  // get requests:
  .get("/getUsers", admin.getUsers)
  // post requests:
  .post("/login", admin.login)
  // patch requests:
  .patch("/blockUser", admin.blockUser)
  .patch("/unblockUser", admin.unblockUser);

module.exports = route;
