'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const {ObjectID} = require('mongodb')
const date = require('date-and-time');
const imageBaseURL = "https://csc309.blob.core.windows.net/swaphub"

// Import our mongoose connection
const {mongoose} = require('./db/mongoose');

// Import the models
const {User} = require('./models/user')
const {Listing} = require('./models/listing')


// express
const app = express();

const mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/template');

app.use('/listings', express.static('static'));
app.use('/sell', express.static('static'));

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
        expires: 900000,
        httpOnly: true
    }
}))

// Add a middleware to check for logged in users:
// Write the middleware function, then use it in our routes
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/listings')
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
        res.redirect('/listings/')
    } else {
        res.redirect('/login/')
    }
})


// Routes for logging in and logging out users

app.post('/users/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // find the user with this username and password
    User.findByUserPassword(username, password).then((user) => {
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
        password: req.body.password,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePic: imageBaseURL + "/users/" + req.body.profilePic,
    })

    // save user to database
    user.save().then((result) => {
        res.send(user)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})

//GET user by username
app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send(user)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
})
/** end of User Routes **/

/** Listing Routes **/
// GET all listings
app.get('/listings', (req, res) => {
    if (req.session.username) {
        res.render("listings", req.session);
    } else {
        res.render("listings");
    }
})

app.get('/sell', (req, res) => {
    if (req.session.username) {
        res.render("add_listing", req.session);
    } else {
        res.render("add_listing");
    }
})

//moved json returning function under API route
app.get('/api/listings', (req, res) => {
    Listing.find().then((listings) => {
        res.send(listings) //put in object in case we want to add other properties
    }, (error) => {
        res.status(400).send(error)
    })
})

// Display listing for given id
app.get('/listings/:id', (req, res) => {
    const id = req.params.id // the id is in the req.params object

    // Good practise is to validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    // Otheriwse, findById
    Listing.findById(id).then((listing) => {
        if (!listing) {
            res.status(404).send()
        } else {
            const data = {
                id: listing.id,
                title: listing.title,
                condition: listing.condition,
                poster: listing.username,
                // poster_profilepic: ,
                price: listing.price,
                date: date.format(new Date(listing.date), 'MMM D[,] YYYY'),
                description: listing.description,
                images: [
                    {demoimgurl: 'img/yeezy750.jpg'},
                    {demoimgurl: 'img/yeezy750feet.jpg'},
                ],
                username: req.session.username,
                profilepic: 'https://csc309.blob.core.windows.net/swaphub/users/' + req.session.username,
                isadmin: req.session.isAdmin
            };
            User.findOne({username: listing.username})
                .then((user) => data["poster_profilepic"] = user.profilePic)
                .then(() => res.render("listing_template", data))

        }

    }).catch((error) => {
        res.status(400).send(error)
    })
})

//Originally just /listings/:id
app.get('/api/listings/:id', (req, res) => {
    const id = req.params.id // the id is in the req.params object

    // Good practise is to validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    // Otheriwse, findById
    Listing.findById(id).then((listing) => {
        if (!listing) {
            res.status(404).send()
        } else {
            res.send(listing)
        }

    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Create new listing:
app.post('/api/listings', (req, res) => {
    // Create a new listing

    const listing = new Listing({
        username: req.session.username,
        title: req.body.title,
        date: Date.now(),
        price: req.body.price,
        condition: req.body.condition,
        category: req.body.category,
        thumbnail: imageBaseURL + "/listings/" + req.body.thumbnail,
        images: req.body.images.map((image) => imageBaseURL + "/listings/" + image),
        description: req.body.description,
        likes: 0
    })
    log(listing)
    // save listing to database
    listing.save().then((result) => {
        // res.send(listing)
        res.redirect("/listings")
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})

// DELETE by listing id
app.delete('/api/listings/:id', (req, res) => {
    const id = req.params.id;
    // Good practise: validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    // Otherwise, find by Id and delete
    Listing.findByIdAndRemove(id).then((listing) => {
        if (!listing) {
            res.status(404).send()
        } else {
            res.send(listing)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
})
/** end of Listing Routes **/

app.listen(port, () => {
    log(`Listening on port ${port}...`)
});
