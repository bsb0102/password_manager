// At the top of your cryptoUtils.js
const crypto = require('crypto-browserify');
const algorithm = 'aes-256-ctr';
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;


exports.generateRandomIV = () => {
  return crypto.randomBytes(16); // 16 bytes (128 bits) is a common size for IVs
};

exports.encrypt = (text, iv) => {
  console.log(secretKey)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

exports.decrypt = (hash, iv) => {
  try {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.log(secretKey)
    console.error("Error in decryption");
    return null; // or handle the error as per your application's needs
  }
};
