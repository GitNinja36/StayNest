const mongoose = require('mongoose'); //accuring mongoose
const Schema = mongoose.Schema; //intialiging schema

const passportLocalMongoose = require("passport-local-mongoose"); //for accuring passport Local Mongoos

const userSchema = new Schema({ //defining the schema
    email: {
        type: String,
        require: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);