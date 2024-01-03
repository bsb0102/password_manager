import axios from 'axios';

// Create the axios instance with your backend's base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:443/api', // Update this to your backend's HTTPS URL
  timeout: 5000, // Adjust the timeout as needed
  headers: {
    'Content-Type': 'application/json', // Set the content type to JSON
  },
});

export default axiosInstance;
