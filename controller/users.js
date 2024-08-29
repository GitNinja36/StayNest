const User = require("../models/user.js");


module.exports.renderSignUpForm = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req, res)=>{
    try{
        let {  username, email, password } = req.body;   //here i require the username , Email and password
        const newUser = new User({email, username}); //then we push the username and Email to the newUser
        //now here by using register function we push the username and Email
        const registeredUser = await User.register(newUser, password); 

        console.log(registeredUser);

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to waderLust!");
            res.redirect("/listings");
        })

    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogInForm =  (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.logIn = async(req, res)=>{
    req.flash("success", "welcome back to the wonderLust, your logged in !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "your are successefully log out");
        res.redirect("/listings");
    })
};