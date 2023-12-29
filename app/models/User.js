const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY; // Use a secure, randomly generated key.

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Encrypt user data before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('username')) return next();

  // Encrypting the username as an example
  this.username = CryptoJS.AES.encrypt(this.username, secretKey).toString();
  next();
});

// Hash password using SHA-256 before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
});

// Method to decrypt data
userSchema.methods.decryptData = function(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Method to validate password (compare hash)
userSchema.methods.validatePassword = function(candidatePassword) {
  const candidateHash = crypto.createHash('sha256').update(candidatePassword).digest('hex');
  return this.password === candidateHash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
