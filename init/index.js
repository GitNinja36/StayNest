//this file is using for inserinting manual data from data.js file to wanderLust database

const mongoose = require("mongoose"); //for connecting mongoose 
const initData = require("./data.js"); // for accuring data

const Listing = require("../models/listing.js"); //for accuring schema

main()
    .then(()=>{
        console.log("connection is DB");
    })
    .catch((err) =>{
        console.log(err);
    });
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//now for inserting data in wanderLust 
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: redirectUrl.id}));
    await Listing.insertMany(initData.data);
    console.log("data has been intialised")
}

initDB();
