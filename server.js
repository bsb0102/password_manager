const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const authRoutes = require('./backend/routes/auth');
const authenticateToken = require('./middleware/authenticateToken');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const cors = require('cors');


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
app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});


module.exports = app;