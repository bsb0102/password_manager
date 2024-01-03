// csrfUtils.js

import axiosInstance from '../api/api.js';

// Function to fetch the CSRF token from the server
export const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get('/api/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token for Login:', error);
    throw error;
  }
};
