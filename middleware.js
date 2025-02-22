const res = require("express/lib/response");
const Listing = require("./models/listing");
const reviews = require("./models/review");
const {reviewSchema}=require("./schema.js");

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/user/login");
    }
    next();
}


const saveRedirectedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async(req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
        
        if(res.locals.currUser && !res.locals.currUser.equals(listing.owner)){
            return res.redirect("/listing");
        }
    next();
}

const isAuthor = async(req,res,next)=>{
    let review = await reviews.findById(req.params.reviewId);
    if(res.locals.currUser && !res.locals.currUser.equals(review.author)){
        return res.redirect("/listing");
    }
    next();
}

//function to check if entered data is correct for review
const validateReview = (req,res,next)=>{
    if(typeof req.body.review.rating === "undefined"){
            req.body.review.rating = 1;
    }
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else
    next();
}

const processListingData = async(req,res,next)=>{
    if(req.params.id){
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(typeof req.body.Listing.image === "undefined"){
            req.body.Listing.image = listing.image;
        }
    }
    else{
    req.body.Listing.image={
        url:req.file.path,
        filename: req.file.filename
    }}
    next();
};
module.exports = {isLoggedIn,saveRedirectedUrl,isOwner,isAuthor,validateReview,processListingData};