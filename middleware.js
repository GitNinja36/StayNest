const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const expressError = require("./util/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js"); 



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you have to logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
};

module.exports.isOwner = async(req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Listing can't be Updated .Do the Login first !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//validation for schema

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next(error);
    }
};

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next(error);
    }
}


module.exports.isReviewAuther = async(req, res, next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId); 

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you can't delete someone review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};