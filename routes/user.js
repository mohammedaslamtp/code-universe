const express = require("express");
const route = express.Router();
const authUser = require("../controller/auth_controller");
const code = require("../controller/code_controller");
const mainController = require("../controller/main_controller");
const auth_token = require("../middlewares/token");
const code_controller = require("../controller/code_controller");
const social_controller = require("../controller/social_controller");
const settings_controller = require("../controller/settings_controller");
const upload = require("../middlewares/multer");

route
  .post("/signup", authUser.signup)
  .post("/login", authUser.login)
  .get("/getUserData", auth_token.authenticate, authUser.getUserData)
  .get("/generateOtp", auth_token.authenticate, authUser.genarateOtp)
  .post("/verifyOtp", auth_token.authenticate, authUser.verifyOtp)
  .get("/generateToken", authUser.genarateToken)
  .get("/codeRun", code.runCode)
  .put("/saveCode", code.saveCodeData)
  .put("/storeCode", auth_token.authenticate, code.storeTemplate)
  .delete("/removeCode", code.removeCode)
  .get("/getTemplates", auth_token.authenticate, mainController.getTemplates)
  .get("/searchCode", mainController.searching)
  .get("/getPrivateCodes", code_controller.getPrivateCodes)
  .get("/getPublicCodes", code_controller.getPublicCodes)
  .patch("/makeItPrivate", auth_token.authenticate, code_controller.makePrivate)
  .patch("/makeItPublic", auth_token.authenticate, code_controller.makePublic)
  .delete("/deleteCode", auth_token.authenticate, code_controller.deleteCode)
  .patch("/following", auth_token.authenticate, social_controller.follow)
  .patch("/unFollowing", auth_token.authenticate, social_controller.unFollow)
  .get(
    "/codeForDownload",
    auth_token.authenticate,
    code_controller.downloadCode
  )
  .post(
    "/upload",
    auth_token.authenticate,
    upload(),
    settings_controller.updateProfile
  )
  .patch(
    "/removeProfile",
    auth_token.authenticate,

    settings_controller.removeProfileImage
  )
  .patch(
    "/updateAbout",
    auth_token.authenticate,

    settings_controller.updateAbout
  );
module.exports = route;
