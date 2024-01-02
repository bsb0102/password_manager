// backend/routes/someRouteFile.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticate'); // Adjust the path as necessary

// ... other route handlers

// A protected route example
router.get('/user', authenticateJWT, (req, res) => {
  // The request is authenticated, and you can access the user from req.user
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

module.exports = router;
