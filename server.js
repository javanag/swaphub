/* server.js nov19 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
const { Student } = require('./models/student')
const { User } = require('./models/user')


// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended: true}))

// session
app.use(session({
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

// route for the root: redirect to the login page
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login')
})

// route for user login page
app.get('/login', sessionChecker, (req, res) => {
	res.sendFile(__dirname + '/public/app/index.html')
})


app.get('/dashboard', (req, res) => {
	// check if we have an active session
	if (req.session.user) {
		res.sendFile(__dirname + '/public/app/listings.html')
	} else {
		res.redirect('/login')
	}
})

// Routes for logging in and logging out users

app.post('/users/login', (req, res) => {
	const email = req.body.email
	const password = req.body.password

	// find the user with this email and password
	User.findByEmailPassword(email, password).then((user) => {
		if (!user) {
			res.redirect('/login')
		} else {
			// Add to the session cookie
			req.session.user = user._id
			res.redirect('/dashboard')
		}
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


/// Student routes go below

// Set up a POST route to create a student
app.post('/students', (req, res) => {
	log(req.body)

	// Create a new student
	const student = new Student({
		name: req.body.name,
		year: req.body.year
	})

	// save student to database
	student.save().then((result) => {
		// Save and send object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})

// GET all students
app.get('/students', (req, res) => {
	Student.find().then((students) => {
		res.send({ students }) // put in object in case we want to add other properties
	}, (error) => {
		res.status(400).send(error)
	})
})

// GET student by id
app.get('/students/:id', (req, res) => {
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	Student.findById(id).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}
		
	}).catch((error) => {
		res.status(400).send(error)
	})
})

app.delete('/students/:id', (req, res) => {
	const id = req.params.id

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	Student.findByIdAndRemove(id).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

app.patch('/students/:id', (req, res) => {
	const id = req.params.id

	// Get the new name and year from the request body
	const { name, year } = req.body
	const properties = { name, year }

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}	

	// Update it
	// $new: true gives back the new document
	Student.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})


/** User routes **/
app.post('/users', (req, res) => {

	// Create a new user
	const user = new User({
		email: req.body.email,
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








