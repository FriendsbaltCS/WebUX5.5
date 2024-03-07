/**
 * 
 * 
 * Database helper functions for user authentication and registration.
 * This module is designed to assist students of Web and the User Experience.
 * 
 * (c) 2024 Joel Hammer
 * Friends School of Baltimore
 * Department of Computer Science
 * 
 * @module db
 * @requires sqlite3
 * @requires bcrypt
 * 
 * 
 * This module is published under the MIT License.
 * For more information, see the LICENSE file in this repository.
 * 
 * 
 * @example
 * const db = require('./db');
 */


const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');


/**
 * Initialize the database to store basic user information.
 */
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


/**
 * Authenticates a user by checking their username and password against the database.
 * @param {Object} user - The user object containing the username and password.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object|null>} - A promise that resolves with the user object if authentication is successful, or null if authentication fails.
 */
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

/**
 * Registers a new user in the database.
 * @param {Object} user - The user object containing user details.
 * @param {string} user.firstName - The first name of the user.
 * @param {string} user.lastName - The last name of the user.
 * @param {string} user.email - The email address of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is registered.
 */
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