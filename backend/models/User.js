const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // MFA related fields
  mfaSecret: {
    type: String, // Stores the MFA secret key
    default: ''
  },
  tempSecret: {
    type: String, // Temporary secret key used during MFA setup
    default: ''
  },
  mfaEnabled: {
    type: Boolean, // Indicates whether MFA is enabled for the user
    default: false
  },
  // Email MFA related fields
  emailMFAEnabled: {
    type: Boolean, // Indicates whether Email MFA is enabled for the user
    default: false
  },
  emailMFAVerificationCode: {
    type: String,
    default: ''
  },
  // Verification code related fields
  verificationCode: {
    type: String,
    default: ''
  },
  verificationCodeExpiresAt: {
    type: Date,
    default: null
  },
  // Reset password token related fields
  resetToken: {
    type: String,
    default: ''
  },
  resetTokenExpiration: {
    type: Date,
    default: null
  },
  emailNotification: {
    loginNotification: {
      type: Boolean,
      default: true,
    }
    // technically can add more notifications parms here
  }
});

// Method to hash passwords
userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, 10);
};

// Method to validate password
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
