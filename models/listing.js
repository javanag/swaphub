const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

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
    likes: Number,
    offers: [{
        bidder: {type: ObjectID, ref: 'User'},
        bid: {type: Number, required: true},
        date: Date
    }]
})

const Listing = mongoose.model('Listing', ListingSchema)

module.exports = {Listing, ListingSchema}
