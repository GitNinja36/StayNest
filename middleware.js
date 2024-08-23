module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "you have to logged in!");
        return res.redirect("/login");
    }
    next();
};