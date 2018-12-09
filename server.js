'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const {ObjectID} = require('mongodb')
const date = require('date-and-time');
const imageBaseURL = "https://csc309.blob.core.windows.net/swaphub/"

// Import our mongoose connection
const {mongoose} = require('./db/mongoose');

// Import the models
const {User} = require('./models/user')
const {Listing} = require('./models/listing')
const {Message} = require('./models/message')


// express
const app = express();


/** region Azure upload **/
const
    multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({storage: inMemoryStorage}).fields([
        {name: 'thumbnail', maxCount: 1},
        {name: 'images', maxCount: 5}
    ])
    , signUploadStrategy = multer({storage: inMemoryStorage}).single("profilePic")
    , azureStorage = require('azure-storage')
    ,
    blobService = azureStorage.createBlobService("DefaultEndpointsProtocol=https;AccountName=csc309;AccountKey=mQsLsREx0NQO3YrnWTjzzYpJ/t0zHzh3cMTs1GBc6/i0edJb2jfcFWCFxnFlamPtFEyddrG+WWhZ08wE8wV6wQ==;EndpointSuffix=core.windows.net")

    , getStream = require('into-stream')
    , containerName = 'swaphub'
;

const handleError = (err, res) => {
    res.status(500);
    res.render('error', {error: err});
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};
/** endregion of azure Upload **/

const mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/template');

app.use('/listings', express.static('static'));
app.use('/users', express.static('static'));
app.use('/sell', express.static('static'));
app.use('/login', express.static('static'));
app.use('/messages', express.static('static'));

// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({extended: true}));

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
};
// Authentication for student resource routes
const authenticate = (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user
                next()
            }
        }).catch((error) => {
            res.redirect('/login')
        })
    } else {
        res.redirect('/login')
    }
}
// static route to public folder
app.use('/public', express.static(__dirname + '/public'));

// route for user login page
app.get('/login', sessionChecker, (req, res) => {
    res.render('login');
})


app.get('/', (req, res) => {
    // // check if we have an active session
    // if (req.session.user) {
    //     res.redirect('/listings/')
    // } else {
    //     res.redirect('/login/')
    // }
    res.redirect('/listings/')
})


// Routes for logging in and logging out users
//Data modification
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

//load messages page:
app.get('/messages', authenticate, (req, res) => {
    res.render("messages", {
        username: req.user.username
    })
})
// open chat with user
app.get('/messages/:username', authenticate, (req, res) => {
    const receiver = req.params.username;

    User.findByUsername(receiver).then((otherUser) => {
        if (!otherUser) {
            res.status(404).send()
        } else {
            res.render("messages", {
                username: req.user.username,
                receiver: {
                    username: otherUser.username,
                    _id: otherUser._id
                }
            })
        }

    })
})

//get all messages for logged user
app.get('/api/messages', authenticate, (req, res) => {
    Message.find().or([{sender: req.user._id}, {receiver: req.user._id}])
        .populate('sender').populate('receiver')
        .then((messages) => {
            res.send(messages)
        }, (error) => {
            res.status(400).send(error)
        }).catch((error) => res.status(400).send(error))

});
// add message from logged user to receiver
app.post('/api/messages/:id', authenticate, (req, res) => {
    const receiverID = req.params.id;

    if (!ObjectID.isValid(receiverID)) {
        log("ID not valid")
        return res.status(404).send()
    }
    // Create a new message
    const message = new Message({
        sender: req.user._id,
        receiver: receiverID,
        read: true,
        content: req.body.content,
        date: new Date()
    })

    // save user to database
    message.save().then((result) => {
        Message.populate(result, "sender")
            .then((msg) => {
                log(msg)
                res.send(msg)
            }).catch((error) => res.status(400).send(error))

        // res.redirect("/messages")
    }, (error) => {
        log("error in saving msg")
        res.status(400).send(error) // 400 for bad request
    })

})

// Display user for given username
app.get('/users/:username', (req, res) => {
    const requestedUsername = req.params.username; // the id is in the req.params object
    const sessUsername = req.session.username;
    // Otheriwse, findByUsername
    User.findOne({username: requestedUsername}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.render("profile", {
                reqUser: user.username,
                sessUser: sessUsername
            });
        }

    }).catch((error) => {
        res.status(400).send(error)
    })
})

// region User Routes
app.post('/api/users', (req, res) => {

    // Create a new user
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePic: imageBaseURL + "users/" + req.body.profilePic,
    })

    // save user to database
    user.save().then((result) => {
        res.send(user)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})


app.post('/users/signup', signUploadStrategy, (req, res) => {
    // Create a new user
    const image = req.file;

    const
        blobName = "users/" + image.originalname
        , stream = getStream(image.buffer)
        , streamLength = image.buffer.length
    ;
    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
        if (err) {
            handleError(err);
            return;
        }
    });

    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePic: imageBaseURL + blobName,
    })

    // save user to database
    user.save().then((result) => {
        // res.send(user)
        req.session.user = result._id;
        req.session.username = result.username;
        req.session.isAdmin = result.isAdmin;
        res.redirect("/")
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})

//GET user by username
app.get('/api/users/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({username: username})
        .populate('userListings')
        .then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                res.send(user)
            }
        }).catch((error) => {
        res.status(400).send(error)
    })
})

// DELETE by user id
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    // Good practise: validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    // Otherwise, find by Id and delete
    User.findByIdAndRemove(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            Listing.remove({
                '_id': {$in: user.userListings}
            }).catch((error) => {
                res.status(400).send(error)
            });
            res.send(user)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/api/users/update/:id', (req, res) => {
    const id = req.params.id;

    // Get the new name and year from the request body
    let data = req.body
    log(data)
    // const properties = { name, year }

    // Good practise is to validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    // Update it
    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            for (let key in data) {
                log(key)
                if (!data[key])
                    continue;
                user[key] = data[key]
            }
            user.save().then((result) => {
                // res.send(user)
                res.redirect("/users/" + user.username)
            }, (error) => {
                res.status(400).send(error) // 400 for bad request
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })

})
//Get user Listings (Deprecated for populate)
app.get('/api/userlistings/:id', (req, res) => {
    const id = req.params.id // the id is in the req.params object

    // Good practise is to validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    // Otheriwse, findById
    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            Listing.find({
                '_id':
                    {$in: user.userListings}
            }, (listings) => {
                if (!listings)
                    res.status(404).send();
                else {
                    res.send(listings)
                }
            }).catch((error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// endregion of User Routes

// region Listing Routes
// GET all listings
app.get('/listings', (req, res) => {
    if (req.session.username) {
        res.render("listings", req.session);
    } else {
        res.render("listings");
    }
})

app.get('/sell', (req, res) => {

    if (req.session.user) {
        res.render("add_listing", req.session);
    } else {
        res.redirect("/login");
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
    Listing.findById(id).populate('offers.bidder')
        .then((listing) => {
            if (!listing) {
                res.status(404).send()
            } else {
                const canDel = listing.isAdmin || listing.username === req.session.username
                const data = {
                    id: listing.id,
                    title: listing.title,
                    condition: listing.condition,
                    poster: listing.username,
                    price: listing.price,
                    date: date.format(new Date(listing.date), 'MMM D[,] YYYY'),
                    description: listing.description,
                    images: listing.images,
                    username: req.session.username,
                    isadmin: req.session.isAdmin,
                    canDel: canDel,
                    offers: listing.offers,
                    views: ++listing.views
                };
                listing.save() // update view count
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

app.post('/api/listings', uploadStrategy, (req, res) => {
    // Create a new listing
    const thumbnailFile = req.files['thumbnail'][0];
    const imagesFile = req.files['images'];
    imagesFile.push(thumbnailFile);

    imagesFile.forEach((file) => {
        // log(file);
        const
            blobName = "listings/" + file.originalname
            , stream = getStream(file.buffer)
            , streamLength = file.buffer.length
        ;
        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {

            if (err) {
                handleError(err);
                return;
            }
        });
    });

    const listing = new Listing({
        username: req.session.username,
        title: req.body.title,
        date: Date.now(),
        price: req.body.price,
        condition: req.body.condition,
        category: req.body.category,
        thumbnail: imageBaseURL + "listings/" + thumbnailFile.originalname,
        images: imagesFile.map((image) => imageBaseURL + "listings/" + image.originalname),
        description: req.body.description,
        views: 0
    });

    // log(listing)
    // save listing to database
    listing.save().then((result) => {
        // res.send(listing)
        // log(result)
        User.findById(req.session.user).then((user) => {
            user.userListings.push(result._id)
            user.save()
        }).catch((error) => {
            res.status(400).send(error)
        })
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
// Add offer to listing
app.post('/api/offer/:id', (req, res) => {
    const listingId = req.params.id // the id is in the req.params object

    // Good practise is to validate the id
    if (!ObjectID.isValid(listingId)) {
        return res.status(404).send()
    }
    const offer = {
        bidder: req.session.user,
        bid: parseFloat(req.body.offerBid),
        date: Date.now()
    }
    // Otheriwse, findById
    Listing.findById(listingId).then((listing) => {
        if (!listing) {
            res.status(404).send()
        } else {
            listing.offers.push(offer);
            listing.save()
                .then((result) => res.send(result),
                    (error) => res.status(400).send(error));
            log(listing)
        }

    }).catch((error) => {
        res.status(400).send(error)
    })
})
// Confirm offer of listing
// app.post('/api/offer/accept/:id')
// endregion Listing Routes

app.listen(port, () => {
    log(`Listening on port ${port}...`)
});
