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

    if (user.mfaEnabled) {
      // MFA is already enabled for this user
      return res.status(400).json({ error: "MFA is already enabled for this user" });
    }

    const secret = mfaService.generateSecret();
    user.tempSecret = secret.base32; // Save the secret temporarily
    await user.save();

    const qrCode = await mfaService.generateQRCode(secret.otpauth_url);
    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    res.status(500).send('Error enabling MFA');
  }
};

exports.deleteMFA = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);

    if (!user.mfaEnabled) {
      // MFA is not enabled for this user
      return res.status(400).json({ error: "MFA is not enabled for this user" });
    }

    // Remove MFA-related fields and disable MFA
    user.mfaSecret = '';
    user.mfaEnabled = false;
    user.tempSecret = ''; // Clear temporary secret if any
    await user.save();

    res.send('MFA is deleted');
  } catch (error) {
    res.status(500).send('Error deleting MFA');
  }
};



exports.addMFA = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);

    if (user.mfaEnabled) {
      // MFA is already enabled for this user
      return res.status(400).json({ error: "MFA is already enabled for this user" });
    }

    const secret = mfaService.generateSecret();
    user.mfaSecret = secret.base32; // Save the secret
    await user.save();

    const qrCode = await mfaService.generateQRCode(secret.otpauth_url);
    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    res.status(500).send('Error adding MFA');
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
      // Only update the MFA status if the token is successfully verified
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

    user.emailMFAEnabled = false;
    user.emailMFAVerificationCode = '';
    await user.save();

    res.json({message: "Successfully disabled MFA"});
  } catch (error) {
    res.status(500).send('Error disabling MFA');
  }
};

exports.getMfaStatus = async (req, res) => {
  try {
    let authToken = req.headers.authorization.split(' ')[1];
    const tempToken = req.headers['x-temp-token']; // Assuming the temporary token is sent in the headers

    // Check if tempToken exists, if so, use it as the authToken
    if (tempToken) {
      authToken = tempToken;
    }
    // Ensure the token is valid before proceeding
    const userId = getUserIdFromToken(authToken);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // Fetch user details from the database based on userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Determine the MFA type based on user settings
    let mfaType;
    if (!user.mfaEnabled && !user.emailMFAEnabled) {
      mfaType = null;
    } else if (user.mfaEnabled) {
      mfaType = "google";
    } else if (user.emailMFAEnabled) {
      mfaType = "email";
    } else {
      mfaType = null;
    }

    // Return the MFA status to the frontend
    res.json({ mfaEnabled: user.mfaEnabled, emailMFAEnabled: user.emailMFAEnabled, mfaType: mfaType });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).send('Error fetching MFA status');
  }
};





exports.toggleMFA = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await UserModel.findById(userId);

    if (user.mfaEnabled) {
      // MFA is enabled; disable it
      user.mfaSecret = '';
      user.mfaEnabled = false;
    } else {
      // MFA is not enabled; enable it
      const secret = mfaService.generateSecret();
      user.tempSecret = secret.base32; // Save the secret temporarily
      user.mfaEnabled = true; // Update the MFA status
    }

    await user.save();

    res.json({ mfaEnabled: user.mfaEnabled });
  } catch (error) {
    res.status(500).send('Error toggling MFA');
  }
};