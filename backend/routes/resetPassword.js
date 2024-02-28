const express = require('express');
const router = express.Router();
import { generateResetPasswordToken, getUserByEmail } from "../controllers/userController"
import { sendPasswordResetEmail } from "../services/mailgunService"

// Route to fetch the CSRF token
app.post('/request-password-reset', async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = await getUserByEmail(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = generateResetPasswordToken();
      // Store token in user document
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      const new_user = await getUserByEmail(username);
      console.log(new_user)
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
