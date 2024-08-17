const express = require("express");
const router = express.Router();

const warpAsync = require("../util/wrapasync.js");
const expressError = require("../util/expressError.js");

const {listingSchema} = require("../schema.js"); 
const Listing = require("../models/listing.js");

//validation for schema
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next(error);
    }
}


//Index Route
router.get("/", warpAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

//New Route
router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", warpAsync(async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
})
);


//Create Route
router.post("/",validateListing, warpAsync(async(req, res, next)=>{    
    const newListings = new Listing(req.body.listing);
    await newListings.save();
    res.redirect("/listings");
    })
); 

//Edit Route
router.get("/:id/edit", warpAsync(async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
);

//Update Route
router.put("/:id",validateListing, warpAsync(async(req, res)=>{
    if(!req.body.listing){
        throw new expressError(400, "send valid listing");
    };
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
);

//DELETE Route
router.delete("/:id", warpAsync(async(req, res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

module.exports = router;