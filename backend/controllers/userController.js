const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import your User model
const VerificationCode = require('../models/VerificationCode');

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

const storeVerificationCode = async (username, code, expiresAt) => {
  try {
    let verificationCode = await VerificationCode.findOne({ username });

    if (verificationCode) {
      // If verification code exists for the username, update it
      verificationCode.code = code;
      verificationCode.expiresAt = expiresAt;
    } else {
      // If verification code doesn't exist, create a new one
      verificationCode = new VerificationCode({
        username: username,
        code: code,
        expiresAt: expiresAt
      });
    }

    await verificationCode.save();
  } catch (error) {
    throw error;
  }
};

// Function to retrieve a verification code by username
const getVerificationCode = async (username) => {
  try {
    const verificationCode = await VerificationCode.findOne({ username });
    return verificationCode ? verificationCode : null;
  } catch (error) {
    throw error;
  }
};

// Function to retrieve the expiration time of a verification code by username
const getVerificationCodeExpiration = async (username) => {
  try {
    const verificationCode = await VerificationCode.findOne({ username });
    return verificationCode ? verificationCode.expiresAt : null;
  } catch (error) {
    throw error;
  }
};

// Function to delete a verification code by username
const deleteVerificationCode = async (username) => {
  try {
    await VerificationCode.deleteOne({ username });
  } catch (error) {
    throw error;
  }
};

const generateVerificationCode = () => {
  const length = 6;
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

// Function to calculate the expiration time for the verification code
const calculateVerificationCodeExpiration = () => {
  // Example: Set the expiration time to 1 hour from now
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1); // Adjust the expiration time as needed
  return expirationTime;
};



module.exports = {
  hashPassword,
  createUser,
  getUserByEmail,
  getUserById,
  storeVerificationCode,
  getVerificationCode,
  getVerificationCodeExpiration,
  deleteVerificationCode,
  generateVerificationCode,
  calculateVerificationCodeExpiration
};
