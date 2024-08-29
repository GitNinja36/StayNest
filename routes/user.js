const express = require("express");
const router = express.Router();
const wrapasync = require("../util/wrapasync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapasync(userController.signUp));

router.get("/login", userController.renderLogInForm);

router.post(
    "/login", 
    savedRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), userController.logIn
);


router.get("/logout", userController.logOut);


module.exports = router;