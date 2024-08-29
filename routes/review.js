const express = require("express");
const router = express.Router({mergeParams: true});

const warpAsync = require("../util/wrapasync.js");


const {listingSchema} = require("../schema.js"); 

const reviews = require("../models/review.js");
const Listing = require("../models/listing.js");

const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

//Review Route 
//post Route
router.post("/",isLoggedIn , warpAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuther, warpAsync(reviewController.destroyaReview));


module.exports = router;