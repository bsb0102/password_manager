const { sendEmailMFAVerificationEmail } = require("../services/mailgunService")
const { generateVerificationCode } = require("../controllers/userController")



// Helper function to generate a random verification code
const generateVerificationCode = () => {
    return Math.random().toString(36).slice(2, 8).toUpperCase(); // Generates a 6-character alphanumeric code
  };
  
  // Helper function to send verification email
  
exports.enableEmailMFA = async (req, res) => {
try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
    return res.status(404).json({ error: "User not found" });
    }

    if (user.emailMFAEnabled) {
    return res.status(400).json({ error: "Email MFA is already enabled for this user" });
    }

    const verificationCode = generateVerificationCode();
    user.emailMFAVerificationCode = verificationCode;
    await user.save();

    await sendEmailMFAVerificationEmail(email, verificationCode);

    res.json({ message: 'Verification code sent to your email' });
} catch (error) {
    console.error('Enable Email MFA error:', error);
    res.status(500).send('Error enabling Email MFA');
}
};

exports.verifyEmailMFA = async (req, res) => {
try {
    const { email, verificationCode } = req.body;

    const user = await UserModel.findOne({ email });

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
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

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
  