const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./backend/App.js'); // Import the Express app

require('dotenv').config();

// Load SSL/TLS certificate and private key
const privateKey = fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Define the PORT variable with a default value of 443 for HTTPS
const PORT = process.env.PORT || 443;

// Create an HTTPS server with the Express app
const server = https.createServer(credentials, app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on HTTPS port https://0.0.0.0:${PORT}/'`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Server terminating...');
    server.close(() => {
        console.log('HTTPS server closed.');
        process.exit(0);
    });
});
