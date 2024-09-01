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
            url: String,
            filename: String,
        },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const listing = mongoose.model("Listing", listingSchema); 
module.exports = listing; //exporting the schema