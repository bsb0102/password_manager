const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const requestLogger = require('../../middleware/requestLogger.js');
const { validateLogin } = require('../../middleware/validation.js'); // Add validation middleware
const { getUserByEmail } = require('../../controllers/userController.js'); // Replace with your user controller

router.use(requestLogger);

router.post('/api/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate the user by fetching user data from the database
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate and send a JWT token upon successful login
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
