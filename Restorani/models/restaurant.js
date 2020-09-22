var mongoose = require("mongoose");
var restaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    province: String,
    street: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User" 
        }, 
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    similarRestaurants: [{
        code: String
    }],
    type: String
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
