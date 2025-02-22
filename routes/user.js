const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const user = require("../models/user");
const passport = require("passport");
const {saveRedirectedUrl} = require("../middleware.js");
const userController = require("../Controller/userController.js");

router.get("/signup", wrapAsync(userController.renderSignUpForm));

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", wrapAsync(userController.renderLogInForm));

router.post("/login",saveRedirectedUrl,passport.authenticate("local",{failureRedirect:"/login"}), wrapAsync(userController.login));

router.get("/logout",wrapAsync(userController.logout));

module.exports = router;