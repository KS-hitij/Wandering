const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../Controller/reviewController.js");

const router = express.Router({mergeParams:true});
const {isLoggedIn, isAuthor,validateReview} = require("../middleware.js");



//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router;