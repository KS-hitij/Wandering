const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const review = require("./review.js");
const { required } = require("joi");
//code for creating the schema of listing
const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    description: String,
    image:{
        filename: String,
        url:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
            type: mongoose.Schema.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    categories:[{
        type:String,
        enum: ["farm","beach","arctic","nature","monument","city","pool","castle","snow","mountain","skiing","river",
            "zoo","rainy","amazingView"
        ]
    }
    ]
});

//middleware for deleting the reviews when the listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
})

module.exports = mongoose.model("listing",listingSchema);