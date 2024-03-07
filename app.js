const express = require('express');
const ejs = require('ejs');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db');

const app = express();
const port = 3000;

//App settings
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('signup.ejs');
});

db.initializeDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});