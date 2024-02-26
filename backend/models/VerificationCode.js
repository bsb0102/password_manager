// models/VerificationCode.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationCodeSchema = new Schema({
  username: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCode;
