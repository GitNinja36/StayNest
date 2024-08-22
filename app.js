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


//connecting the feature of passport 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


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


//inetialing the passport sessions
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  //serialize users into the session
passport.deserializeUser(User.deserializeUser()); //deserialize users into the session


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// listing Router (for listing)
const listingRouter = require("./routes/listing.js");
// Review Router (for review)
const reviewRouter = require("./routes/review.js");
// User Router (for signUp)
const userRouter = require("./routes/user.js");


// app.get("/demoUser", async(req, res)=>{
//     let fakeUser = User({
//         eamil: "abcd@gmail.com",
//         username: "zexgero",
//     });
//     let newUser = await User.register(fakeUser, "123456");
//     res.send(newUser);
// });



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new expressError(404, "page not found"));
});

//Error Route for catching error form route and from listings
app.use((err, req, res, next)=>{
        let {statusCode = 404, message = "Something went wrong"} = err;
        res.status(statusCode).render("error.ejs", {message});
        // res.status(statusCode).send(message);
});
