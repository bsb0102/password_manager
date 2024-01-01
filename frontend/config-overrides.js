// This is a simple example of a config-overrides.js file
// It doesn't make any actual changes to the configuration.

module.exports = function override(config, env) {
    // Do something with the config...
    console.log('Running with overridden config...');
  
    // For example, to add a custom plugin:
    // const MyAwesomeWebpackPlugin = require('my-awesome-webpack-plugin');
    // config.plugins.push(new MyAwesomeWebpackPlugin());

    // You must return the updated config object.
    return config;
};
