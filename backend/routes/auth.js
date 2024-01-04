const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../controllers/userController'); // Replace with your user controller
const cryptoUtils = require('../models/cryptoUtils');
const Password = require("../models/Password");
const mongoose = require('mongoose');

router.get("/user_test", async (req, res) => {
  res.json({message: "Status True"})
});

// Testing route with JWT authentication

router.get('/decryptPasswordById', async (req, res) => {
  try {
    const { id } = req.query; // ID of the password entry

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Fetch the password entry by ID
    const passwordEntry = await Password.findById(id);

    if (!passwordEntry) {
      return res.status(404).json({ error: 'Password entry not found' });
    }

    // Extract the iv and content from the password entry
    const { iv, content } = passwordEntry.encryptedPassword;

    // Decrypt the password
    const decryptedPassword = cryptoUtils.decrypt({ content }, iv);

    res.json({ decryptedPassword });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Error decrypting password' });
  }
});




router.post('/encryptPassword', (req, res) => {
  try {
    const { password } = req.body;
    // Ensure password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    // Generate a random IV
    const iv = cryptoUtils.generateRandomIV();
    // Encrypt the password
    const encryptedData = cryptoUtils.encrypt(password, iv);
    res.json(encryptedData);
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Error encrypting password' });
  }
});


router.post('/login', async (req, res) => {

  
  try {
    const { username, password } = req.body;

    // Authenticate the user by fetching user data from the database
    const user = await getUserByEmail(username);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failure' });
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

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await getUserByEmail(username);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(username, hashedPassword);

    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
