module.exports = {
  // Other webpack configuration options...

  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 3002,  // Specify the allowed hosts here
    setupMiddlewares: function (middlewares, devServer) {
      // If you had custom logic in the deprecated methods, implement it here
      return middlewares;
    },
    // Other devServer options...
  },
};
