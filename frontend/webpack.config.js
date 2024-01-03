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
  },
  devServer: {
    allowedHosts: 'all',
    host: process.env.HOST || '0.0.0.0', // Listen on all available network interfaces
    port: process.env.PORT || 443, // Use port 443 for HTTPS
    open: true,
    hot: true,
    historyApiFallback: true,
    https: true, // Enable HTTPS
    key: fs.readFileSync('./password_manager/key.pem'), // Provide the path to your SSL/TLS key
    cert: fs.readFileSync('./password_manager/cert.pem'), // Provide the path to your SSL/TLS certificate
  },
};
