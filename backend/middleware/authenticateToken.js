const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Debugging: Log the decoded token payload
    console.log('Decoded JWT Token:', verified);

    next();
  } catch (error) {
    // Debugging: Log token verification error
    console.error('Token Verification Error:', error);

    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
