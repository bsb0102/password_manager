const jwt = require('jsonwebtoken');
const mfaService = require('../models/mfaService');
const UserModel = require('../models/User'); // Adjust the path to your user model

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

exports.enableMFA = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);
    const secret = mfaService.generateSecret();

    user.tempSecret = secret.base32; // Save the secret temporarily
    await user.save();

    const qrCode = await mfaService.generateQRCode(secret.otpauth_url);
    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    res.status(500).send('Error enabling MFA');
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    const authToken = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(authToken);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!user.mfaSecret) {
      return res.status(400).send('MFA is not enabled for this user');
    }

    const verified = mfaService.verifyToken(user.mfaSecret, token);

    if (verified) {
      user.mfaEnabled = true;
      user.tempSecret = '';
      await user.save();

      res.send('MFA is verified and enabled');
    } else {
      res.status(400).send('Invalid MFA Token');
    }
  } catch (error) {
    console.error('Error verifying MFA token:', error);
    res.status(500).send('Error verifying MFA token');
  }
};


exports.disableMFA = async (req, res) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(authToken);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);
    user.mfaSecret = '';
    user.mfaEnabled = false;
    await user.save();

    res.send('MFA is disabled');
  } catch (error) {
    res.status(500).send('Error disabling MFA');
  }
};

exports.getMfaStatus = async (req, res) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(authToken);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ mfaEnabled: user.mfaEnabled });
  } catch (error) {
    res.status(500).send('Error fetching MFA status');
  }
};
