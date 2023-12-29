const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the login route
router.post('/login', authController.login);

// Define other authentication routes as needed

module.exports = router;