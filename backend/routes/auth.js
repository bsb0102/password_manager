const express = require('express');
const router = express.Router();
const User = require('../../app/models/User');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(401).json({ message: 'Login failed' });
  }
  const hash = crypto.createHash('sha256').update(password + user.salt).digest('hex');
  if (user.hash !== hash) {
    return res.status(401).json({ message: 'Login failed' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ accessToken: token });
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
