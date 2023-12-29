const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user (replace with your database query)
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  // Verify password using bcrypt
  bcrypt.compare(password, user.password, (err, passwordMatch) => {
    if (err || !passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate and send a JWT token upon successful login
    const token = jwt.sign({ userId: user.id, email: user.email }, 'yourSecretKey');
    res.json({ message: 'Login successful', token });
  });
});
