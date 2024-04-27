const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Check if there's a temporary token in the headers
  const tempToken = req.headers['x-temp-token'];
  // Use the temporary token if it exists
  const authToken = tempToken || token;

  if (!authToken) return res.status(401).json({ error: 'Access denied' });
  console.log(authToken)
  const verified = jwt.verify(authToken, process.env.JWT_SECRET);
  console.log("tessssxxx", verified)
  try {
    req.user = verified;
    // Debugging: Log the decoded token payload

    next();
  } catch (error) {
    // Debugging: Log token verification error
    console.error('Token Verification Error:', error);

    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
