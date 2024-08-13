const express = require("express");
const app = express();

let port = 8080;
app.listen(port, ()=>{
    console.log(`server is listing to the port ${port}`);
});

const mongoose = require('mongoose');
main()
    .then(()=>{
        console.log("connection is successfull");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const Listing = require("./models/listing.js");


const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//requiring ejs-Mate npm pakage
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);


//for requiring static files from public folder
app.use(express.static(path.join(__dirname, "/public")));

//for requiring wrapAsync function from different file
const warpAsync = require("./util/wrapasync.js");


//for requiring expressError function from different file
const expressError = require("./util/expressError.js");

//for requiring schemaValid function from different file
const {listingSchema, reviewSchema} = require("./schema.js"); 

//for requiring Review route
const reviews = require("./models/review.js");

//
const listings = require("./routes/listing.js");


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next(error);
    }
}

app.use("/listings", listings);


//Review Route 
//post Route
app.post("/listings/:id/reviews", warpAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReviews = new reviews(req.body.Review);

    listing.reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);

}));

//Delete Route
app.delete("/listings/:id/reviews/:reviewId",warpAsync(async(req, res)=>{
    let { id, reviewId } = req.params;
    await reviews.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.all("*", (req, res, next)=>{
    next(new expressError(404, "page not found"));
});

//Error Route for catching error form route and from listings
app.use((err, req, res, next)=>{
        let {statusCode = 404, message = "Something went wrong"} = err;
        res.status(statusCode).render("error.ejs", {message});
        // res.status(statusCode).send(message);
});


app.get("/", (req, res)=>{
    res.send("this route is working");
});