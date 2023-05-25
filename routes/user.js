const express = require("express");
const route = express.Router();
const authUser = require("../controller/auth_controller");
const code = require("../controller/code_controller");
const auth_token = require("../middlewares/token");

route
  .post("/signup", authUser.signup)
  .post("/login", authUser.login)
  .get("/getUserData", auth_token.authenticate, authUser.getUserData)
  .get("/generateOtp", auth_token.authenticate, authUser.genarateOtp)
  .post("/verifyOtp", auth_token.authenticate, authUser.verifyOtp)
  .get("/generateToken", authUser.genarateToken)
  .get("/codeRun", auth_token.authenticate, code.runCode)
  .put("/saveCode", auth_token.authenticate, code.saveCodeData)
  .put("/storeCode", auth_token.authenticate, code.storeTemplate)
  .delete("/removeCode", code.removeCode);

module.exports = route;
