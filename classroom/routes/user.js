const express = require("express");
const router = express.Router();
//USER
//Index 
router.get("/", (req, res)=>{
    res.send("GET route for Index Route");
});
//Show 
router.get("/:id", (req, res)=>{
    res.send("GET route for Show Route");
});
//Post 
router.post("/", (req, res)=>{
    res.send("POST route for Edit Route");
});
//Delete 
router.delete("/:id", (req, res)=>{
    res.send("Delete route");
});

module.exports = router;