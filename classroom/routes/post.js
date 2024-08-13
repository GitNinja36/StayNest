const express = require("express");
const router = express.Router();
//POST
//Index 
router.get("/", (req, res)=>{
    res.send("GET route for Posts");
});
//Show 
router.get("/:id", (req, res)=>{
    res.send("GET route for Posts id");
});
//Post 
router.post("/", (req, res)=>{
    res.send("POST route for Posts");
});
//Delete 
router.delete("/:id", (req, res)=>{
    res.send("Delete route for Posts");
});
module.exports = router;