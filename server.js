/* server.js nov19 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const {ObjectID} = require('mongodb')

// Import our mongoose connection
const {mongoose} = require('./db/mongoose');

// Import the models
const {User} = require('./models/user')


// express
const app = express();
// app.use(express.static(__dirname + '/public'));
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({extended: true}))

// session
app.use(session({
    isAdmin: false,
    secret: 'somesecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000,
        httpOnly: true
    }
}))

// Add a middleware to check for logged in users:
// Write the middleware function, then use it in our routes
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}
// static route to public folder
app.use('/public', express.static(__dirname + '/public'));

// route for the root: redirect to the login page
// app.get('/', sessionChecker, (req, res) => {
// 	res.redirect('/login')
// })

// route for user login page
app.get('/login', sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/app/index.html')
})


app.get('/', (req, res) => {
    // check if we have an active session
    if (req.session.user) {
        if (req.session.isAdmin)
            res.sendFile(__dirname + '/public/app/listings_admin.html');
        else
            res.sendFile(__dirname + '/public/app/listings.html')
    } else {
        res.redirect('/login')
    }
})


// Routes for logging in and logging out users

app.post('/users/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // find the user with this username and password
    User.findByUserPassword(username, password).then((user) => {
        // if (!user) {
        //     res.redirect('/login')
        // } else {
        //     // Add to the session cookie
        //     req.session.user = user._id
        //     res.redirect('/dashboard')
        // }
        if (user) {
            req.session.user = user._id;
            req.session.username = user.username;
            req.session.isAdmin = user.isAdmin;
        }
        res.redirect('/')
    }).catch((error) => {
        res.status(400).redirect('/login')
    })

})

app.get('/users/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.redirect('/')
        }
    })
})

/** User routes **/
app.post('/users', (req, res) => {

    // Create a new user
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    // save user to database
    user.save().then((result) => {
        res.send(user)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})


app.listen(port, () => {
    log(`Listening on port ${port}...`)
});








