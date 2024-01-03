import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Retrieve the JWT token from localStorage or sessionStorage
  const token = localStorage.getItem('token');

  // Check if the token exists
  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the token exists, render the children components (protected content)
  return children;
};

export default ProtectedRoute;
