const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,processListingData} = require("../middleware.js");
const listingController= require("../Controller/listingsController.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });

//function to check if entered data is correct for listing
const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else
    next();
}

//Index Route
router.get("/",wrapAsync(listingController.index))

//category route
router.get("/category/:filter",wrapAsync(listingController.categoryIndex));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//create listing route
router.post("/create",isLoggedIn,upload.single("Listing[image]"),processListingData,validateListing ,wrapAsync(listingController.createNewListing))

//show listing route
router.get("/:id",wrapAsync(listingController.showListings));

//edit listing route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

//update listing route
router.put("/:id",isLoggedIn,isOwner,upload.single("Listing[image]"),processListingData,validateListing,wrapAsync(listingController.updateListing));

//delete listing route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));



module.exports = router;