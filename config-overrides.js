module.exports = function override(config, env) {
    console.log('Environment:', env);
    // Do stuff with the webpack config...
    return config;
};
