const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

//The flash is a special area of the session used for storing messages.
const flash = require('connect-flash');

//requiring express-session
const session = require('express-session');

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
  //   cookie: { secure: true }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res)=>{
    let { name = "anonymous" } = req.query;
    req.session.name = name;

    if( name === "anonymous"){
        req.flash("error", "user not regesterd!");
    }else{
        req.flash("success", "user regesterd successfully!");
    }

    res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
    res.render("page.ejs", {name: req.session.name});
});
 
// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{ 
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("madeIn", "India", {signed: true});
//     res.send("signed cookies sent");
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("hii", "there");
//     res.cookie("greet", "namaste");
//     res.send("send you some cookies!!!");
// });

// app.get("/greet", (req, res)=>{
//     let { name="anonymous" } = req.cookies;
//     res.send(`hi ${name}`);
// });


app.get("/", (req, res)=>{
    console.dir(req.cookies);
    res.send("Route is working");
});

app.use("/users", users);

app.use("/posts", posts);


app.listen(3000, ()=>{
    console.log("route working at 3000");
});