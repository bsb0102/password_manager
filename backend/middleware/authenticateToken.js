const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  console.log('Generated Token:', token);
  if (!token) {
    return res.status(401).json({ error: 'Authentication failed: Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Authentication failed: Invalid token' });
    }
    req.user = user; // Store user information in the request
    next();
  });
}

module.exports = authenticateToken;
