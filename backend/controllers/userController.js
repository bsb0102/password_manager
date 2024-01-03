const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import your User model

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // You can increase the salt rounds for more security
  return bcrypt.hash(password, salt);
};

// Function to create a new user record in the database
const createUser = async (email, hashedPassword) => {
  try {
    const user = new User({
      email: email,
      password: hashedPassword,
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to fetch a user by their email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
  createUser,
  getUserByEmail,
};
