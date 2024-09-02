const express = require("express");
const router = express.Router();

const warpAsync = require("../util/wrapasync.js");

const Listing = require("../models/listing.js");

//requiring the middleware for loggedin
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//requiring the listings.js from controller file for making code more compact 
const listingController = require("../controller/listings.js");

//requiring the multer for uploading files
const multer  = require('multer')

const {storage} = require("../cloudConfig.js");

const upload = multer({ storage });


//router.route(path) its an instance of single route for root route
router.route("/")
    .get(warpAsync(listingController.index)) //Index Route
    .post(
        isLoggedIn, 
        // validateListing, 
        upload.single('listing[image]'),
        warpAsync(listingController.createListing)
    ); //Create Route


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//again router.route(path) its an instance of single route for "/listings/:id" route
router.route("/:id")
    .get(warpAsync(listingController.showListing)) //Show Route
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('listing[image]'), 
        validateListing, 
        warpAsync(listingController.udateListing)) //Update Route
    .delete(isLoggedIn, isOwner, warpAsync(listingController.destroyListing) //DELETE Route
);


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  warpAsync(listingController.renderEditRoute));

module.exports = router;