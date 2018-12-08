/* Message model */
const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;


const Message = mongoose.model('Message', {
	sender: { type: ObjectID, ref: 'User', required: true },
	receiver: { type: ObjectID, ref: 'User', required: true },
	read: Boolean,
	content: String,
	date: Date
})

module.exports = { Message };
