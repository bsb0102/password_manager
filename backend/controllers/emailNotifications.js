const { sendSuccessEmailMFAEmail } = require("../services/mailgunService")
const { getUserById } = require("../controllers/userController")
const { getUserIdFromToken } = require('../models/cryptoUtils'); // Adjust the path as necessary



const fetchUserData = async (token) => {
    const userId = await getUserIdFromToken(token);
    const user = await getUserById(userId);
    return user;

}


exports.getEmailNotificationStatus = async (req, res) => {
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

exports.setEmailNotificationStatus = async (req, res) => {
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