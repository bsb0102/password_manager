import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/api.js';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Assuming your axiosInstance is already set up to include credentials like cookies
        // If not, ensure to include { withCredentials: true } in the config
        const response = await axiosInstance.post('/api/validate-token');
        if (response.data.isValid) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Token validation failed');
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, []);

  // if (!isAuthenticated) {
  //   console.log("")
  //   return <Navigate to="/login" />
  // }
  
  return children;
};

export default ProtectedRoute;
