const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../controllers/userController'); // Replace with your user controller
const cryptoUtils = require('../models/cryptoUtils');
const Password = require("../models/Password");
const mongoose = require('mongoose');
const mfaService = require('../models/mfaService'); // Import your MFA service functions here



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

    console.log("iv: ", iv)
    console.log("content: ", content)

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

    console.log("Helloworldiungton")

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

    // Determine if MFA is enabled for the user
<<<<<<< HEAD
<<<<<<< HEAD
    const requireMfa = user.mfaEnabled;

    // Generate and send a JWT token upon successful login
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    // Respond with the JWT token and whether MFA is required
    res.json({ message: 'Login successful', token, requireMfa });
=======
=======
>>>>>>> v1
    const requireMfa = user.mfaEnabled || user.emailMFAEnabled;
    // Generate a JWT token upon successful login
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    // Set the token as an HTTP cookie with HttpOnly flag
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Ensure this is enabled in production
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });
    
    // Send login notification email
    const userIPAddress = req.ip.toString(); // Get the user's IP addresss

    if (!requireMfa) {
      await sendLoginNotification(username, userIPAddress);
    }

    res.json({ message: 'Login successful', token: token,  requireMfa });
>>>>>>> v1
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
    newUser.mfaEnabled = false; // Set MFA to false when registering

    await newUser.save();

    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> v1
router.post('/verifyCode', async (req, res) => {
  try {
    const { username, verificationCode, password } = req.body;

    console.log(password)

    // Retrieve the stored verification code and expiration time
    const storedVerificationCode = await getVerificationCode(username);

    // Check if there is a stored verification code for the user
    if (!storedVerificationCode) {
      return res.status(400).json({ error: 'No verification code found for this user' });
    }

    // Check if the provided verification code matches the stored one
    if (verificationCode !== storedVerificationCode.code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if the verification code has expired
    const currentTime = new Date();
    if (currentTime > storedVerificationCode.expiresAt) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Proceed with registration logic to create the new user
    const newUser = await createUser(username, hashedPassword);
    await newUser.save();

    // Optionally, delete the verification code from the database
    await deleteVerificationCode(username);

    // Return a success message along with any additional data, such as a JWT token
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.put('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;    
    // Fetch the user by userId
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





>>>>>>> v1
module.exports = router;
