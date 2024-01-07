const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generateSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

const generateQRCode = async (otpauth_url) => {
  try {
    return await QRCode.toDataURL(otpauth_url);
  } catch (err) {
    throw new Error('Error generating QR Code');
  }
};

const verifyToken = (userSecret, token) => {
  return speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'base32',
    token: token
  });
};

module.exports = {
  generateSecret,
  generateQRCode,
  verifyToken
};
