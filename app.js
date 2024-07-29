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

//Index Route
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async(req, res)=>{
    let{ id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async(req, res)=>{
    // let { title, description, image, price, country, location } = req.body;
    const newListings =  Listing(req.body.listing);
    await newListings.save();
    res.redirect("/listings");
}); 

//Edit Route
app.get("/listings/:id/edit", async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
});

//DELETE Route
app.delete("/listings/:id", async(req, res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.get("/", (req, res)=>{
    res.send("this route is working");
});