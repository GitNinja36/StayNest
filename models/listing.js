//this file is using for defining the schema for upcoming data
const mongoose = require('mongoose'); //accuring mongoose
const review = require("./review.js");
const Schema = mongoose.Schema; //intialiging schema
const listingSchema = new Schema({ //defining the schema
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
            type: String,
            set: (v) => v === ""
            ? "https://images.unsplash.com/photo-1721804975881-1768e59f46cb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            : v,
        },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const listing = mongoose.model("Listing", listingSchema); 
module.exports = listing; //exporting the schema