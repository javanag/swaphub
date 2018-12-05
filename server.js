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
const {Listing} = require('./models/listing')


// express
const app = express();
// app.use(express.static(__dirname + '/public'));
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({extended: true}));

/** Azure upload try **/
//Import azure connection:
const storage = require('azure-storage');
const blobService = storage.createBlobService("DefaultEndpointsProtocol=https;AccountName=csc309;AccountKey=mQsLsREx0NQO3YrnWTjzzYpJ/t0zHzh3cMTs1GBc6/i0edJb2jfcFWCFxnFlamPtFEyddrG+WWhZ08wE8wV6wQ==;EndpointSuffix=core.windows.net");

const
    router = express.Router()
    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({storage: inMemoryStorage}).single('file')
    , getStream = require('into-stream')
    , containerName = 'swaphub'
;

// app.use('/*', fileUpload.single('file'));
const handleError = (err, res) => {
    res.status(500);
    res.render('error', {error: err});
};

router.post('/', uploadStrategy, (req, res) => {
    const
        blobName = eq.file.originalname
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;
    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {

        if (err) {
            handleError(err);
            return;
        }

        res.render('success', {
            message: 'File uploaded to Azure Blob storage.'
        });
    });
});
/** end of Azure Upload try **/

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
        res.redirect('/dashboard')
    } else {
        next()
    }
}
// static route to public folder
app.use('/public', express.static(__dirname + '/public'));

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
        profilePic: "https://csc309.blob.core.windows.net/swaphub/users/" + req.body.profilePic,
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
    Listing.find().then((listings) => {
        res.send(listings) //put in object in case we want to add other properties
    }, (error) => {
        res.status(400).send(error)
    })
})

// GET listing by id
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
            res.send(listing)
        }

    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Create new listing:
app.post('/listings', (req, res) => {
    // Create a new listing
    /** Upload to azure try 2
     log(req)
     log(req.file)
     let path = req.file.thumbnail.path;
     log(path)
     blobService.createBlockBlobFromLocalFile("swaphub", "csc309", path, (error, result, response) => {
        if (error) {
            log(error)
        } else {
            log(result)
            log("uploaded to azure");
        }
    })
     res.send("OK");
     **/
    const currUsername = (req.body.username) ? req.body.username : req.session.username
    const listing = new Listing({
        username: currUsername,
        title: req.body.title,
        date: Date.now(),
        price: parseFloat(req.body.price),
        condition: req.body.condition,
        category: req.body.category,
        thumbnail: "https://csc309.blob.core.windows.net/swaphub/listings/" + req.body.thumbnail,
        description: req.body.description,
        likes: 0
    })

    // save listing to database
    listing.save().then((result) => {
        // res.send(listing)
        // log(result)
        res.redirect('/')
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })

})

// DELETE by listing id
app.delete('/listings/:id', (req, res) => {
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








