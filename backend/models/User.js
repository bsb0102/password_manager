
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
  }
  // You can add more fields as needed
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
