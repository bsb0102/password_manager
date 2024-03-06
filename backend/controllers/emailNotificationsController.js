const { sendSuccessEmailMFAEmail } = require("../services/mailgunService")
const { getUserById } = require("./userController")
const { getUserIdFromToken } = require('../models/cryptoUtils'); // Adjust the path as necessary



const fetchUserData = async (token) => {
    const userId = await getUserIdFromToken(token);
    const user = await getUserById(userId);
    return user;

}


const getLoginNotificationStatus = async (user) => {
    
}


exports.getEmailNotificationStatus = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await fetchUserData(token)

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const emailNotificaitonStatus = user.emailNotification

        res.json({ emailNotificaitonStatus });
    } catch (error) {
        console.error('Getting Email Notification Status:', error);
        res.status(500).send('Error getting Email Notification Status');
    }
};

exports.updateEmailNotificationStatus = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await fetchUserData(token);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { parentKey, childKey, status } = req.body;

        // Assuming 'parentKey' is the key for the specific notification category
        // and 'childKey' is the key for the specific notification type within the category
        user.emailNotification[childKey] = status;

        // Update user data in the database
        await user.save();

        res.json({ message: "Email notification status updated successfully" });
    } catch (error) {
        console.error('Updating Email Notification Status:', error);
        res.status(500).send('Error updating Email Notification Status');
    }
};