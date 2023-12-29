const express = require('express');
const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require('./routes/auth');

// Mount the authentication route
app.use('/api', authRoute); // Assuming you want authentication routes under '/api'

// Define and mount your routes (e.g., in 'routes/index.js')
const routes = require('./routes');
app.use('/', routes);

module.exports = app;

