const mfaService = require('../models/mfaService');
const UserModel = require('../models/User'); // Replace with your actual user model path

const enableMFA = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id); // Assuming user ID is in req.user
    const secret = mfaService.generateSecret();

    // Save the secret temporarily or until confirmed
    user.tempSecret = secret.base32;
    await user.save();

    const qrCode = await mfaService.generateQRCode(secret.otpauth_url);

    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    res.status(500).send('Error enabling MFA');
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.body;
  const user = await UserModel.findById(req.user.id);

  const verified = mfaService.verifyToken(user.tempSecret, token);
  if (verified) {
    user.mfaSecret = user.tempSecret;
    user.tempSecret = '';
    user.mfaEnabled = true;
    await user.save();

    res.send('MFA is verified and enabled');
  } else {
    res.status(400).send('Invalid MFA Token');
  }
};

const disableMFA = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    user.mfaSecret = '';
    user.mfaEnabled = false;
    await user.save();

    res.send('MFA is disabled');
  } catch (error) {
    res.status(500).send('Error disabling MFA');
  }
};

module.exports = {
  enableMFA,
  verifyToken,
  disableMFA
};
