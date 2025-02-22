const Joi = require('joi');  //joi used for server side schema validation
const listing = require('./models/listing');
const review = require('./models/review')

module.exports.listingSchema = Joi.object({
    Listing: Joi.object(
        {
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.object({
                filename: Joi.string().required(),
                url: Joi.string().required(),
            }).required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
            country: Joi.string().required(),
            reviews: Joi.array(),
            categories: Joi.array()
        }
    ).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object(
        {
            rating: Joi.number().required().min(1).max(5),
            comment: Joi.string().required()
        }
    ).required()
})