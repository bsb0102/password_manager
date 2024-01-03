const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  website: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  }
});

// Method to encrypt password before saving
passwordSchema.pre('save', async function(next) {
  if (this.isModified('encryptedPassword')) {
    this.encryptedPassword = await bcrypt.hash(this.encryptedPassword, 10);
  }
  next();
});

const Password = mongoose.model('Password', passwordSchema);
module.exports = Password;
