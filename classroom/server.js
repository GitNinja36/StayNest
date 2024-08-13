const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.use("/users", users);

app.use("/posts", posts);


app.get("/", (req, res)=>{
    res.send("Route is working");
});

app.listen(3000, ()=>{
    console.log("route working at 3000");
});