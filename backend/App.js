const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/authenticateToken');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/mainRoutes.js');
const https = require('https');
const fs = require('fs');
const killPort = require('kill-port');
const connectDB = require('./database');
require('dotenv').config();

// Use the API_BASE_URL environment variable for your backend
const API_BASE_URL = process.env.REACT_APP_API;

console.log("Loggin1: ", API_BASE_URL);

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://82.165.221.131:443'], // Update with your frontend URL during development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 443;

connectDB();
const privateKey = fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server with the Express app
const server = https.createServer(credentials, app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("testing: ", API_BASE_URL)
app.use(API_BASE_URL, authRoutes);

// Static file serving for production frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Global error handler
app.use(errorHandler);

// Start server function
async function startServer() {
  try {
    await Promise.all([killPortIfInUse(3000), killPortIfInUse(PORT)]);
    server.listen(PORT, () => {
      console.log(`Backend is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

// Function to kill a port if it is in use
async function killPortIfInUse(port) {
  try {
    await killPort(port, 'tcp');
    console.log(`Port ${port} is now free`);
  } catch (err) {
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Server terminating...');
  server.close(() => {
    console.log('HTTPS server closed.');
    process.exit(0);
  });
});

startServer();

module.exports = app;
