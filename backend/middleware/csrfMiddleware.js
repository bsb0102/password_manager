const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: true, // Enable CSRF cookie
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Ignore CSRF for these HTTP methods
});

module.exports = csrfProtection;
