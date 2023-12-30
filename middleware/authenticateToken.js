const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Authorization: Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user; // set the user to req so in the route we can access the logged in user
    next(); // pass the execution off to whatever request the client intended
  });
};

module.exports = authenticateToken;