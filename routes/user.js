const express = require("express");
const route = express.Router();
const authUser = require("../controller/auth_controller");
const code = require("../controller/code_controller");
const mainController = require("../controller/main_controller");
const auth_token = require("../middlewares/token");
const code_controller = require("../controller/code_controller");
const social_controller = require("../controller/social_controller");
const settings_controller = require("../controller/settings_controller");
const editor_controller = require("../controller/editor_controller");
const upload = require("../middlewares/multer");
const main_controller = require("../controller/main_controller");

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
  .get("/getTemplates", mainController.getTemplates)
  .get("/searchCode", mainController.searching)
  .get("/getPrivateCodes", code_controller.getPrivateCodes)
  .get("/getPublicCodes", code_controller.getPublicCodes)
  .patch("/makeItPrivate", auth_token.authenticate, code_controller.makePrivate)
  .patch("/makeItPublic", auth_token.authenticate, code_controller.makePublic)
  .delete("/deleteCode", auth_token.authenticate, code_controller.deleteCode)
  .patch("/following", auth_token.authenticate, social_controller.follow)
  .patch("/unFollowing", auth_token.authenticate, social_controller.unFollow)
  .patch("/like", auth_token.authenticate, social_controller.like)
  .patch("/disLike", auth_token.authenticate, social_controller.disLike)
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
  )
  .get(
    "/isUsernameUnique",
    auth_token.authenticate,
    settings_controller.isUsernameUnique
  )
  .patch(
    "/changeUsername",
    auth_token.authenticate,
    settings_controller.changeUsername
  )
  .patch(
    "/changePassword",
    auth_token.authenticate,
    settings_controller.changePassword
  )
  .get("/getTemplateDetail", mainController.getTemplateDetail)
  .get("/getEditorOptions", editor_controller.getEditorDetails)
  .patch(
    "/changeEditorTheme",
    auth_token.authenticate,
    editor_controller.changeTheme
  )
  .patch(
    "/changeFontSize",
    auth_token.authenticate,
    editor_controller.changeFontSize
  )
  .patch(
    "/changeTabSize",
    auth_token.authenticate,
    editor_controller.changetabSize
  )
  .patch(
    "/adjustLineNumber",
    auth_token.authenticate,
    editor_controller.adjustLineNumber
  )
  .patch(
    "/adjustLineWrapping",
    auth_token.authenticate,
    editor_controller.adjustLineWrapping
  )
  .patch(
    "/editorSuggestions",
    auth_token.authenticate,
    editor_controller.editorSuggestions
  )
  .patch(
    "/formatOnSave",
    auth_token.authenticate,
    editor_controller.formatOnSave
  )
  .get("/isValidLive", auth_token.authenticate, main_controller.isValidLive)
  .get("/allComments", auth_token.authenticate, social_controller.allComments)
  .get("/likedUsers", auth_token.authenticate, social_controller.likedUsers)
  .post("/addToPin", auth_token.authenticate, social_controller.addToPin)
  .patch(
    "/removeFromPin",
    auth_token.authenticate,
    social_controller.removeFromPin
  )
  .get(
    "/getAllFollowingUsers",
    auth_token.authenticate,
    social_controller.getAllFollowingUsers
  )
  .get(
    "/getAllFollowers",
    auth_token.authenticate,
    social_controller.getAllFollowers
  )
  .post(
    "/storeLiveCode",
    auth_token.authenticate,
    code_controller.storeLiveCode
  )
  .get("/runLiveCode", auth_token.authenticate, code_controller.runLiveCode);
module.exports = route;
