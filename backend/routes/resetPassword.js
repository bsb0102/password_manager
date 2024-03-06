const express = require('express');
const router = express.Router();
const { generateResetPasswordToken, verifyResetPasswordToken, getUserByEmail, getUserById } = require("../controllers/userController")
const { sendPasswordResetEmail } = require("../services/mailgunService")
const bcrypt = require('bcrypt');


// Route to fetch the CSRF token
router.get('/request-password-resset', async (req, res) => {
    res.status(200).json({success: "Route Success"})
})


router.post('/request-password-reset', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await getUserByEmail(username);
        if (!user) {
            return res.json({ message: 'Password reset email sent' }); // Even tho Email won't sent, to avoid bruteforce through this route
        }
        
        const token = generateResetPasswordToken(user._id);
        
        // Store token in user document
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send password reset email with the reset password link
        const resetPasswordLink = `${process.env.REACT_APP_API_BASE_URL}/reset-password/${token}`;
        await sendPasswordResetEmail(username, resetPasswordLink);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/verify-reset-password-token/:token', (req, res) => {
    const { token } = req.params;
    const verificationResult = verifyResetPasswordToken(token);
    if (verificationResult.isValid) {
        // Token is valid, userId can be accessed using verificationResult.userId
        res.json({ isValid: true, userId: verificationResult.userId });
    } else {
        // Token is not valid
        res.json({ isValid: false });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verify the reset password token
        const user = await verifyResetPasswordToken(token);
        if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const userById = await getUserById(user.userId);
        if (!userById) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        userById.password = hashedPassword;
        userById.resetToken = undefined;
        userById.resetTokenExpiration = undefined;
        await userById.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  

module.exports = router;
