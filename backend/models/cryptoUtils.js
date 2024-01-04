const crypto = require('crypto-browserify');
const algorithm = 'aes-256-ctr';

exports.generateRandomIV = () => {
  return crypto.randomBytes(16); // 16 bytes (128 bits) is a common size for IVs
};

exports.encrypt = (text, secretKey, iv) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

exports.decrypt = (hash, secretKey, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrypted.toString();
};
