const express = require("express");
const router = express.Router();
const wrapasync = require("../util/wrapasync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");
const { route } = require("./listing.js");


//router.route(path) its an instance of single route for Sign Up route
router.route("/signup")
    .get(userController.renderSignUpForm)  //for getting Sign up page
    .post(wrapasync(userController.signUp) //for signup
);

//router.route(path) its an instance of single route for Log Up route
router.route("/login")
.get(userController.renderLogInForm)   //for getting Log In page
.post(                                 // for login
    savedRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), userController.logIn
); 

router.get("/logout", userController.logOut);


module.exports = router;