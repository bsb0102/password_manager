import axios from 'axios';

// Use an environment variable or default to a specific URL
const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://safekey.gg/';

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

export const decryptPassword = async (encryptedPassword) => {
  try {
    const response = await axiosInstance.get(`/decryptPassword?encryptedPassword=${encryptedPassword}`);
    return response.data; // Return the decrypted password
  } catch (error) {
    console.error('Error decrypting password:', error);
    throw error;
  }
};



export default axiosInstance;
