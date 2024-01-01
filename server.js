const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./backend/middleware/errorHandler');
const authenticateToken = require('./backend/middleware/authenticateToken');
const routes = require('./backend/routes/index.js');
const https = require('https');
const fs = require('fs');
const killPort = require('kill-port');
require('dotenv').config();

const app = express();

// Define the PORT variable with a default value of 3002
const PORT = process.env.PORT || 3002;

// Load SSL/TLS certificate and private key
const privateKey = fs.readFileSync('/root/password_manager/key.pem', 'utf8');
const certificate = fs.readFileSync('/root/password_manager/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server with the Express app
const server = https.createServer(credentials, app);

// Function to kill a port if it is in use
function killPortIfInUse(port) {
  return new Promise((resolve, reject) => {
    killPort(port, 'tcp')
      .then(() => {
        console.log(`Port ${port} is now free`);
        resolve();
      })
      .catch((err) => {
        console.error(`Killing port ${port}: ${err.message}`);
        resolve(); // Continue even if the port was not in use
      });
  });
}

// Kill ports 3000 and PORT before starting the server
Promise.all([killPortIfInUse(3000), killPortIfInUse(3002), killPortIfInUse(PORT)])
  .then(() => {
    // Allow the system to choose an available port
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error starting server: ${err.message}`);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);
app.use('/api/auth', require('./backend/routes/auth'));
app.get('/protected', authenticateToken, (req, res) => {
  res.send('Protected route accessed!');
});
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});
app.use(errorHandler);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Server terminated.');
  server.close(() => {
    console.log('HTTPS server closed.');
    process.exit(0);
  });
});
