const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const authRoutes = require('./backend/routes/auth');
const authenticateToken = require('./middleware/authenticateToken');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const cors = require('cors');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(requestLogger);
// Serve static files (if needed)
app.use(express.static('public'));
app.use(errorHandler);

// Define and mount your routes (e.g., in 'routes/index.js')
const routes = require('./backend/routes/');
app.use('/', routes);

app.get('/protected', authenticateToken, (req, res) => {
  // This route is now protected, the req.user is available here
  res.send('Protected route accessed!');
});

// Start the server
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match the above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;