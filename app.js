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
// const warpAsync = require("./util/wrapasync.js");


//for requiring expressError function from different file
const expressError = require("./util/expressError.js");

//for requiring schemaValid function from different file
// const {listingSchema, reviewSchema} = require("./schema.js"); 

//requring express-session
const session = require('express-session');

//defing sessionOption
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true 
    },
};

//The flash is a special area of the session used for storing messages.
const flash = require('connect-flash');


app.get("/", (req, res)=>{
    res.send("this route is working");
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//
const listings = require("./routes/listing.js");
//
const reviews = require("./routes/review.js");


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next)=>{
    next(new expressError(404, "page not found"));
});

//Error Route for catching error form route and from listings
app.use((err, req, res, next)=>{
        let {statusCode = 404, message = "Something went wrong"} = err;
        res.status(statusCode).render("error.ejs", {message});
        // res.status(statusCode).send(message);
});
