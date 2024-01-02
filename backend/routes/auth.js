const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { hashPassword } = require('../controllers/userController.js');

router.post(`/auth/login`, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log(user)

    if (user && user.validatePassword(password)) {
      // Correct password, create a JWT token
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ message: 'Logged in successfully', token: token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error });
  }
});


router.post(`/auth/register`, async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      username,
      hash: hashedPassword,
      salt: '', // You can omit the salt if you're using bcrypt
    });

    // Save the user
    console.log(user)
    await user.save();
    
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering user', error });
  }
});



module.exports = router;
