const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const cors = require('cors');
const path = require('path');
const errorHandler = require('./backend/middleware/errorHandler');
const authenticateToken = require('./backend/middleware/authenticateToken');
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB (adjust the connection string and options as needed)
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define and mount your routes
const routes = require('./backend/routes/index.js');
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
