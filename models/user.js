/* Users model */
const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;
const validator = require('validator')
const bcrypt = require('bcryptjs')

// We'll make this model in a different way
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        trim: true, // trim whitespace
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, // trim whitespace
        validate: {
            validator: validator.isEmail,
            message: 'Not valid email'
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstName: String,
    lastName: String,
    profilePic: String,
    userListings: [{ type: ObjectID, ref: 'Listing' }],
    userReviews: [{ type: ObjectID, ref: 'Review' }]
})
UserSchema.statics.findByUsername = function (username) {
    const User = this
    return User.findOne({username: username}).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return new Promise((res, rej) => {
            resolve(user)
        })
    })
}
// created our own find method
UserSchema.statics.findByUserPassword = function (username, password) {
    const User = this

    return User.findOne({username: username}).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })

    })
}

// This function runs before saving user to database
UserSchema.pre('save', function (next) {
    const user = this;

    // check to make sure we don't hash again
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next()
            })
        })
    } else {
        next();
    }
})


const User = mongoose.model('User', UserSchema)

module.exports = {User}