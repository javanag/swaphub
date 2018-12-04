/* Review model */
const mongoose = require('mongoose')

const Review = mongoose.model('Review', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace 
		unique: true
	},
	year: {
		type: Number,
		required: true
	}
})

module.exports = { Review }
