const crypto = require('crypto');
const fs = require('fs');

// Generate a random secret
const secret = crypto.randomBytes(64).toString('hex');

// Save the secret to .env file
fs.writeFileSync('.env', `SESSION_SECRET=${secret}`);

console.log('Secret generated and saved to .env file.');