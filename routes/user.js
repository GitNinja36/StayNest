const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../util/wrapasync.js");
const passport = require("passport");


router.get("/signup", (req, res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(async(req, res)=>{
    try{
        let {  username, email, password } = req.body;   //here i require the username , Email and password
        const newUser = new User({email, username}); //then we push the username and Email to the newUser
        //now here by using register function we push the username and Email
        const registeredUser = await User.register(newUser, password); 

        console.log(registeredUser);
        req.flash("success", "welcome to waderLust!");
        res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
});

router.post(
    "/login", 
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), 
    async(req, res)=>{
        req.flash("success", "welcome back to the wonderLust, your logged in !");
        res.redirect("/listings");
    }
);


router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "your are successefully log out");
        res.redirect("/listings");
    })
});


module.exports = router;