const { sendSuccessEmailMFAEmail, sendEmailMFACode } = require("../services/mailgunService")
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

        const { verificationCode } = req.body;
 
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.emailMFAEnabled) {
            return res.status(400).json({ error: "Email MFA is already enabled for this user" });
        }

        if (verificationCode !== user.emailMFAVerificationCode) {
            return res.status(400).json({error: "Invalid Activation Code"})
        }

        user.emailMFAEnabled = true;
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

        let token = req.headers.authorization.split(' ')[1];
        const tempToken = req.headers['x-temp-token']; // Assuming the temporary token is sent in the headers

        // Check if tempToken exists, if so, use it as the authToken
        if (tempToken) {
            token = tempToken;
        }
        
        // Fetch user data using the token
        const user = await fetchUserData(token);

        // If user data is not found, return 404
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const user_emailMFA_Code = await user.emailMFAVerificationCode;

        // Check if the verification code matches
        if (verificationCode === user_emailMFA_Code) {
            return res.json({ status: 'success' });
        } else {
            // If verification fails, return 400
            return res.status(400).json({ status: 'Failed' });
        }
    } catch (error) {
        // Log and handle unexpected errors
        console.error('Verify Email MFA error:', error);
        return res.status(500).json({ error: 'Internal server error' });
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
  


exports.sendEmailMfa = async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const tempToken = req.headers['x-temp-token']; // Assuming the temporary token is sent in the headers

        // Check if tempToken exists, if so, use it as the authToken
        if (tempToken) {
            token = tempToken;
        }
        
        // Fetch user data using the token
        const user = await fetchUserData(token);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const verification_token = await sendEmailMFACode(user.username);
        user.emailMFAVerificationCode = await verification_token
        await user.save();

        res.json({ message: 'Successfully sent MFA to your Email' });
    } catch (error) {
        console.error('Send Email MFA error:', error);
        res.status(500).send('Error sending Email MFA');
    }
};