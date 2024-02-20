const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./backend/App.js'); // Import the Express app

require('dotenv').config();
env = module.exports = process.env;

// Load SSL/TLS certificate and private key
const privateKeyPath = '/etc/letsencrypt/live/safekey.gg/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/safekey.gg/fullchain.pem';
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Define the PORT variable with a default value of 443 for HTTPS
// console.log(env.SECRET_KEY)
const PORT = process.env.PORT || 5000;

// Create an HTTPS server with the Express apsp
const server = https.createServer(credentials, app);

// Start the server
server.listen(443, "safekey.gg", () => {
    console.log(`Server is running on HTTPS port https://safekey.gg:${PORT}/'`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Server terminating...');
    server.close(() => {
        console.log('HTTPS server closed.');
        process.exit(0);
    });
});
