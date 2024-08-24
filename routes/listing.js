const express = require("express");
const router = express.Router();

const warpAsync = require("../util/wrapasync.js");

const Listing = require("../models/listing.js");

//requiring the middleware for loggedin
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


//Index Route
router.get("/", warpAsync( async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

//New Route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", warpAsync(async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})
);


//Create Route
router.post("/", isLoggedIn, validateListing, warpAsync(async(req, res, next)=>{    
    const newListings = new Listing(req.body.listing);
    newListings.owner = req.user._id;
    await newListings.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    })
); 

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  warpAsync(async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})
);

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, warpAsync(async(req, res)=>{
    if(!req.body.listing){
        throw new expressError(400, "send valid listing");
    };
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
})
);

//DELETE Route
router.delete("/:id", isLoggedIn, isOwner,   warpAsync(async(req, res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
})
);

module.exports = router;