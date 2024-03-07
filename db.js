const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

async function initializeDatabase() {
    const db = new sqlite3.Database('database.db', (err) => {
        if (err) {
        console.error(err.message);
        } else {
        console.log('Connected to the database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            username TEXT,
            password TEXT
        )`, (err) => {
            if (err) {
            console.error(err.message);
            } else {
            console.log('Users table created.');
            }
        });
        }
    });
}

async function authenticateUser(user) {
    const { username, password } = user;
    const db = new sqlite3.Database('database.db');

    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                if (row) {
                    const validPassword = await bcrypt.compare(password, row.password);
                    if (validPassword) {
                        console.log('User authenticated.');
                        resolve(row);
                    } else {
                        console.log('Invalid password.');
                        resolve(null);
                    }
                } else {
                    console.log('User not found.');
                    resolve(null);
                }
            }
        });
        db.close();
    });
}

async function registerUser(user) {
    const { firstName, lastName, email, username, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = new sqlite3.Database('database.db');
    db.run('INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, email, username, hashedPassword], (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('User registered.');
        }
    });
    db.close();
}

module.exports = { initializeDatabase, registerUser, authenticateUser }; // Export the function