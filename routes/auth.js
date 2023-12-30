const express = require('express');
const router = express.Router();
const User = require('../app/models/User');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const hash = crypto.createHash('sha256').update(password + user.salt).digest('hex');

    if (hash === user.hash) {
      // Login successful
      res.status(200).json({ message: 'Login successful' });
      // Implement token generation or session creation here as needed
    } else {
      // Login failed
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});


// Endpoint to register 2FA
router.get('/setup-2fa', (req, res) => {
    const secret = speakeasy.generateSecret({ length: 20 });
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      // Save secret.ascii to the user's database record...
      res.json({ qrCode: data_url });
    });
  });
  
  // Endpoint to verify 2FA token
  router.post('/verify-2fa', (req, res) => {
    const { token, userId } = req.body;
    const user = userId// Fetch user from the database using userId
    const verified = speakeasy.totp.verify({
      secret: user.googleAuthSecret,
      encoding: 'ascii',
      token: token
    });
    
    if (verified) {
      // User is verified
    } else {
      // Verification failed
    }
  });

module.exports = router;
