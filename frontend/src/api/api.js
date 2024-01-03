import axios from 'axios';

// Use an environment variable or default to a specific URL
const baseURL = process.env.REACT_APP_BACKEND_URL || 'https://82.165.221.131/';

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
