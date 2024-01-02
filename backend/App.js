const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/authenticateToken');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/mainRoutes.js'); // Assumed import, replace with your actual routes file
const https = require('https');
const fs = require('fs');
const killPort = require('kill-port');
const connectDB = require('./database');
require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 443;

connectDB();
const privateKey = fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server with the Express app
const server = https.createServer(credentials, app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken); // If you want to apply this middleware globally

// Routes
app.use('/auth', authRoutes);

// Protected routes
// Apply the authenticateToken middleware to routes that require authentication
app.use('/app', authenticateToken, appRoutes); // Protected app-specific routes

// Example of a protected route
app.get('/protected-route', authenticateToken, (req, res) => {
  // This route is now protected, the user will need a valid token to access it
  res.json({ message: 'This is a protected route.' });
});

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
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
  }
}

// Function to kill a port if it is in use
async function killPortIfInUse(port) {
  try {
    await killPort(port, 'tcp');
    console.log(`Port ${port} is now free`);
  } catch (err) {
    console.error(`Error killing port ${port}:`, err.message);
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
