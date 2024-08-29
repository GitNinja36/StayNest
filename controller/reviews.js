const Listing = require("../models/listing");
const reviews = require("../models/review");

module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    console.log("Review Data:", req.body.review);
    
    // if (!listing) {
    //     throw new expressError(404, "Listing not found");
    // }

    let newReview = new reviews(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        // console.log(pr);

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
    // console.log(listing);

}

module.exports.destroyaReview = async(req, res)=>{
    let { id, reviewId } = req.params;
    await reviews.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};