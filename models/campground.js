var mongoose = require("mongoose");

// STEP2: SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
            },
        username: String
            },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// STEP3: MODEL SETUP
module.exports = mongoose.model("Campground", campgroundSchema);