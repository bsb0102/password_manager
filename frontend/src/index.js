import React from 'react';
import { createRoot } from 'react-dom'; // Import createRoot from react-dom
import App from './App.js'; // Adjust this path as necessary
import './index.css';

// Use createRoot to render your application
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
