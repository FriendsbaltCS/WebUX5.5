const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

//Session settings
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false 
}));

//App settings
app.set('view engine', 'ejs');

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.authenticateUser({username, password})
    .then((user) => {
      if (user) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.redirect('/login');
      }
    })
    .catch((error) => {
      res.status(500).send('Error authenticating user');
    });
});

app.get('/register', (req, res) => {
  res.render('signup.ejs');
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  const userData = {
    firstName,
    lastName,
    email,
    username,
    password
  };
  db.registerUser(userData)
    .then(() => {
      res.redirect('/login');
    })
    .catch((error) => {
      res.status(500).send('Error registering user');
      console.log(error);
    });
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});


db.initializeDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}