const express = require('express');
const csrfMiddleware = require('../middleware/csrfMiddleware'); // Import the CSRF middleware
const router = express.Router();

// Route to fetch the CSRF token
router.get('/csrf-token', csrfMiddleware, (req, res) => {
  // Get the CSRF token from the request object
  const csrfToken = req.csrfToken();
  
  // Respond with the CSRF token as JSON
  res.json({ csrfToken });
});

module.exports = router;
