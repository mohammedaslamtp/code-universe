const express = require("express");
const route = express.Router();
const authUser = require("../controller/auth_controller");
const code = require("../controller/code_controller");
const mainController = require("../controller/main_controller");
const auth_token = require("../middlewares/token");
const code_controller = require("../controller/code_controller");

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
  .delete("/removeCode", code.removeCode)
  .get("/getTemplates", auth_token.authenticate, mainController.getTemplates)
  .get("/searchCode",mainController.searching)
  .get("/getPrivateCodes",code_controller.getPrivateCodes)
  .get("/getPublicCodes",code_controller.getPublicCodes)
  .patch("/makeItPrivate",auth_token.authenticate,code_controller.makePrivate)
  .patch("/makeItPublic",auth_token.authenticate,code_controller.makePublic)
  .delete("/deleteCode",auth_token.authenticate,code_controller.deleteCode)
module.exports = route;
