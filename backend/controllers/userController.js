const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // You can increase the salt rounds for more security
  return bcrypt.hash(password, salt);
};