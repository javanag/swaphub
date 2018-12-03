const mongoose = require('mongoose')

// connect to our database
mongoose.connect('mongodb://server:team52@ds044587.mlab.com:44587/team52', { useNewUrlParser: true});

module.exports = { mongoose }