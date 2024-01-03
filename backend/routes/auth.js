// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../controllers/userController'); // Replace with your user controller
const authenticateJWT = require('../middleware/authenticate'); // Import the authenticate middleware
const csrfProtection = require('../middleware/csrfMiddleware');


router.get('/testing', authenticateJWT, (req, res) => {
  res.json({ message: 'Authenticated route', user: req.user });
});

router.get('/csrf-token', csrfProtection, (req, res) => {
  // Get the CSRF token from the request object
  const csrfToken = req.csrfToken();

  // Send the CSRF token as a JSON response
  res.json({ csrfToken });
});


router.post('/login', csrfProtection, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Authenticate the user by fetching user data from the database
    const user = await getUserByEmail(username);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate and send a JWT token upon successful login
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', csrfProtection, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await getUserByEmail(username);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const newUser = await createUser(username, hashedPassword);

    // Generate and send a JWT token upon successful registration
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
