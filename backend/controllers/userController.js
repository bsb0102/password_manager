const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import your User model

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // You can increase the salt rounds for more security
  return bcrypt.hash(password, salt);
};

// Function to create a new user record in the database
const createUser = async (username, hashedPassword) => {
  try {
    const user = new User({
      username: username,
      password: hashedPassword,
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to fetch a user by their email
const getUserByEmail = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to fetch a user by their ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
  createUser,
  getUserByEmail,
  getUserById,
};
