const { sendSuccessEmailMFAEmail } = require("../services/mailgunService")
const { generateVerificationCode, getUserById } = require("../controllers/userController")
const { getUserIdFromToken } = require('../models/cryptoUtils'); // Adjust the path as necessary



const fetchUserData = async (token) => {
    const userId = await getUserIdFromToken(token);
    const user = await getUserById(userId);
    return user;

}


exports.enableEmailMFA = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await fetchUserData(token)

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.emailMFAEnabled) {
            return res.status(400).json({ error: "Email MFA is already enabled for this user" });
        }

        user.emailMFAEnabled = true;
        user.emailMFAVerificationCode = '';
        await user.save();
        await sendSuccessEmailMFAEmail(user.username);

        res.json({ message: 'Successfully enabled Multi Factor for Email' });
    } catch (error) {
        console.error('Enable Email MFA error:', error);
        res.status(500).send('Error enabling Email MFA');
    }
};

exports.verifyEmailMFA = async (req, res) => {
    try {
        const { verificationCode } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const user = getUserIdFromToken(token);


        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }

        if (!user.emailMFAVerificationCode) {
        return res.status(400).json({ error: "No verification code found for this user" });
        }

        if (verificationCode !== user.emailMFAVerificationCode) {
        return res.status(400).json({ error: "Invalid verification code" });
        }

        user.emailMFAEnabled = true;
        user.emailMFAVerificationCode = ''; // Clear verification code
        await user.save();

        res.json({ message: 'Email MFA enabled successfully' });
    } catch (error) {
        console.error('Verify Email MFA error:', error);
        res.status(500).send('Error verifying Email MFA');
    }
};

exports.disableEmailMFA = async (req, res) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        const user = getUserIdFromToken(token);

        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }

        if (!user.emailMFAEnabled) {
        return res.status(400).json({ error: "Email MFA is not enabled for this user" });
        }

        user.emailMFAEnabled = false;
        await user.save();

        res.json({ message: 'Email MFA disabled successfully' });
    } catch (error) {
        console.error('Disable Email MFA error:', error);
        res.status(500).send('Error disabling Email MFA');
    }
};
  