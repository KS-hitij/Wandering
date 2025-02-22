const review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");

module.exports.postReview = (async(req,res)=>{
    const {id} = req.params;
    const currlisting = await Listing.findById(id);
    if(!currlisting){
        throw new ExpressError(404,"Listing Not Found!");
    }
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    currlisting.reviews.push(newReview);
    await newReview.save();
    await currlisting.save();
    res.redirect(`/listing/${req.params.id}`);
})

module.exports.deleteReview = (async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
})