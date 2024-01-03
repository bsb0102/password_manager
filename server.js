const https = require('https');
const fs = require('fs');
const path = require('path');
const killPort = require('kill-port');
const app = require('./backend/App.js'); // Import the Express app from the backend

require('dotenv').config();

// Load SSL/TLS certificate and private key
const privateKey = fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Define the PORT variable with a default value of 443 for HTTPS
const PORT = process.env.PORT || 443;

// Create an HTTPS server with the Express app
const server = https.createServer(credentials, app);

// Function to kill a port if it is in use
async function killPortIfInUse(port) {
  try {
    await killPort(port, 'tcp');
    console.log(`Port ${port} is now free`);
  } catch (err) {
    console.error(`Error freeing port ${port}: ${err.message}`);
  }
}

// Start the server
(async () => {
  try {
    await killPortIfInUse(PORT);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on HTTPS port ${PORT}`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
  }
})();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Server terminating...');
  server.close(() => {
    console.log('HTTPS server closed.');
    process.exit(0);
  });
});
