module.exports = function override(config, env) {
    console.log('Webpack Config:', config);
    console.log('Environment:', env);
    // Do stuff with the webpack config...
    return config;
};
