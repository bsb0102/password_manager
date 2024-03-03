// At the top of your cryptoUtils.js
const crypto = require('crypto-browserify');
const algorithm = 'aes-256-ctr';
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;


exports.generateRandomIV = () => {
  return crypto.randomBytes(16); // 16 bytes (128 bits) is a common size for IVs
};

exports.encrypt = (text, iv) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

exports.decrypt = (content, iv) => {
  if (!content || !iv) {
    console.error("Content or IV is undefined. Cannot decrypt.");
    return null;
  }
  try {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Error in decryption:", error);
    return null;
  }
};

exports.getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

