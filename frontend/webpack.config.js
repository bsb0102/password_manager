const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const fs = require('fs'); // Make sure to require 'fs' to read the files

// Load environment variables from .env file
require('dotenv').config();

module.exports = {
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
    new webpack.HotModuleReplacementPlugin(),
  ],
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
    alias : {
      '@backend': path.resolve(__dirname, '../backend/controllers')
    }
  },
  devServer: {
    allowedHosts: 'all',
    host: process.env.HOST || 'safekey.gg', // Listen on all available network interfaces
    port: process.env.PORT || 3000, // Use port 443 for HTTPS
    open: true,
    hot: true,
    historyApiFallback: true,
    https: true, // Enable HTTPS
    key: fs.readFileSync('/etc/letsencrypt/live/safekey.gg/privkey.pem'), // Provide the path to your SSL/TLS key
    cert: fs.readFileSync('/etc/letsencrypt/live/safekey.gg/fullchain.pem'), // Provide the path to your SSL/TLS certificate
  },
};
