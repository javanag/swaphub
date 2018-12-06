const mongoose = require('mongoose')

const ListingSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        trim: true, // trim whitespace
    },
    title: String,
    date: Date,
    price: Number,
    condition: String,
    category: String,
    thumbnail: String,
    images: [String],
    description: String,
    likes: Number
})

const Listing = mongoose.model('Listing', ListingSchema)

module.exports = {Listing, ListingSchema}
