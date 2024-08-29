const express = require("express");
const router = express.Router();

const warpAsync = require("../util/wrapasync.js");

const Listing = require("../models/listing.js");

//requiring the middleware for loggedin
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


const listingController = require("../controller/listings.js");


//Index Route
router.get("/", warpAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", warpAsync(listingController.showListing));


//Create Route
router.post("/", isLoggedIn, validateListing, warpAsync(listingController.createListing)); 

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  warpAsync(listingController.renderEditRoute));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, warpAsync(listingController.udateListing));

//DELETE Route
router.delete("/:id", isLoggedIn, isOwner, warpAsync(listingController.destroyListing));

module.exports = router;