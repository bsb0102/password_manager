const path = require('path');

module.exports = function override(config, env) {
  // Add your customizations here
  
  // Example: Add a new alias for importing modules
  config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');

  // You can add more customizations as needed
  
  return config;
};
