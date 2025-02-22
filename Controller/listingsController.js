const mapsKey = process.env.TILERMAPS_API_KEY;
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = mapsKey;


module.exports.index=(async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const start = (page - 1) * limit;
    const end = page*limit;
    const allListings = await Listing.find().skip(start).limit(limit);
    const totalListings = await Listing.countDocuments();
    const result = {
        allListings,
        next: page + 1,
        prev: page - 1,
        hasNextPage: end < totalListings,
    };
    if (req.query.ajax) {
        return res.json(result);
    }
    let filter = undefined;
    let destination = undefined;
    res.render("listings/index.ejs", { result,filter,destination });
});

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};

module.exports.createNewListing =(async (req,res)=>{
    req.body.Listing.owner =req.user._id;
    const newListing = await Listing(req.body.Listing);
    await newListing.save();
    console.log("Listing saved successfully");
    res.redirect(`/listing/${newListing._id}`);
});

module.exports.showListings =(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    const result = await maptilerClient.geocoding.forward(listing.location);
    const coordinates = result.features[1].geometry.coordinates;
    res.render("listings/show",{listing,mapsKey,coordinates});
});

module.exports.renderEditForm=(async (req,res)=>{
    const listing = await Listing.findOne({_id:req.params.id});
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_200");
    res.render("listings/edit",{listing, originalImageUrl});
});

module.exports.updateListing=(async (req,res)=>{
    await Listing.findOneAndUpdate({_id:req.params.id},{...req.body.Listing},{new:true, runValidators: true});
    res.redirect(`/listing/${req.params.id}`);
});

module.exports.deleteListing=(async (req,res)=>{
    await Listing.findOneAndDelete({_id:req.params.id});
    res.redirect("/listing");
});

module.exports.categoryIndex=(async (req,res)=>{
    let {filter} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const start = (page - 1) * limit;
    const end = page*limit;
    const allListings = await Listing.find({categories:{$in:[filter]}}).skip(start).limit(limit);
    const totalListings = await Listing.countDocuments({categories:{$in:[filter]}});
    const result = {
        allListings,
        next: page + 1,
        prev: page - 1,
        hasNextPage: end < totalListings,
    };
    if (req.query.ajax) {
        return res.json(result);
    }
    let destination = undefined;
    res.render("listings/index.ejs",{result,filter,destination});
});

module.exports.search=(async (req,res)=>{
    let {destination} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const start = (page - 1) * limit;
    const end = page*limit;
    const allListings = await Listing.find({
        location: { $regex: new RegExp(destination, "i") }
    }).skip(start).limit(limit);
    
    const totalListings = await Listing.countDocuments({
        location: { $regex: new RegExp(destination, "i") }
    });
    const result = {
        allListings,
        next: page + 1,
        prev: page - 1,
        hasNextPage: end < totalListings,
    };
    if (req.query.ajax) {
        return res.json(result);
    }
    let filter = "";
    res.render("listings/index.ejs", { result,filter,destination });
});