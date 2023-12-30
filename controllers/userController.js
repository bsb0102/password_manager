// userController.js

// Sample user data (replace with actual database queries)
const users = [
    { id: 1, email: 'user1@example.com', password: '$2b$10$Gy3SC.s...hashedPassword1' },
    { id: 2, email: 'user2@example.com', password: '$2b$10$A3J4xR.d...hashedPassword2' },
  ];
  
  // Function to get a user by email (replace with database query)
  async function getUserByEmail(email) {
    return users.find((user) => user.email === email) || null;
  }
  
  module.exports = { getUserByEmail };
  