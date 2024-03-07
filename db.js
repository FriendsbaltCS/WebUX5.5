const sqlite3 = require('sqlite3').verbose();

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

module.exports = { initializeDatabase }; // Export the function