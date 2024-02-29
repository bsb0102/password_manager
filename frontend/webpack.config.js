const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs'); // Make sure to require 'fs' to read the files

// Load environment variables from .env file
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDeveloping = argv.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      isDeveloping && new webpack.HotModuleReplacementPlugin(), // Include HMR plugin only in development
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "crypto-browserify": require.resolve('crypto-browserify'), 
      },
      alias: {
        '@backend': path.resolve(__dirname, '../backend/controllers')
      }
    },
    devServer: {
      allowedHosts: 'all',
      host: process.env.HOST || '0.0.0.0', // Listen on all available network interfaces
      port: isDeveloping ? 3000 : process.env.PORT || 443, // Use port 3000 for development, otherwise use PORT or default to 443
      open: true,
      hot: isDeveloping,
      historyApiFallback: true,
      https: isProduction, // Enable HTTPS only in production
      ...(isProduction && { // Conditionally add SSL/TLS configuration only in production
        key: fs.readFileSync('/etc/letsencrypt/live/safekey.gg/privkey.pem'), // Provide the path to your SSL/TLS key
        cert: fs.readFileSync('/etc/letsencrypt/live/safekey.gg/fullchain.pem'), // Provide the path to your SSL/TLS certificate
      }),
    },
  };
};
