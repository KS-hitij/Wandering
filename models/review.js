const { type } = require("express/lib/response");
const { ref } = require("joi");
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("Review",reviewSchema);