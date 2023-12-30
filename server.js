const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (if needed)
app.use(express.static('public'));

// Define and mount your routes (e.g., in 'routes/index.js')
const routes = require('./routes');
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
