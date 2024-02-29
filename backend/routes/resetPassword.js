const express = require('express');
const router = express.Router();
const { generateResetPasswordToken, getUserByEmail } = require("../controllers/userController")
const { sendPasswordResetEmail } = require("../services/mailgunService")

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
        
        const token = generateResetPasswordToken();
        // Store token in user document
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        await sendPasswordResetEmail(username, token)

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
