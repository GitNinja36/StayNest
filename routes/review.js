const express = require("express");
const router = express.Router({mergeParams: true});

const warpAsync = require("../util/wrapasync.js");
const expressError = require("../util/expressError.js");

const {reviewSchema, listingSchema} = require("../schema.js"); 

const reviews = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next(error);
    }
}


//Review Route 
//post Route
router.post("/", warpAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    console.log("Review Data:", req.body.review);
    
    // if (!listing) {
    //     throw new expressError(404, "Listing not found");
    // }

    let newReview = new reviews(req.body.review);
    console.log(newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        // console.log(pr);

    res.redirect(`/listings/${listing._id}`);
    // console.log(listing);

}));

//Delete Route
router.delete("/:reviewId",warpAsync(async(req, res)=>{
    let { id, reviewId } = req.params;
    await reviews.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;