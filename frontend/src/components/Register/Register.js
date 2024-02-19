import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api.js';
import { getCsrfToken } from '../../utils/csrfUtils.js';
import '../Login/AuthForm.css';
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // State to store the CSRF token

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the CSRF token from the server using Axios
        const response = await axiosInstance.get('/api/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Include the CSRF token in the form data
    const data = {
      username: username,
      password: password,
      _csrf: csrfToken,
    };
  
    // Send the POST request with the CSRF token included
    try {
      const response = await axiosInstance.post('/api/register', data);
  
      // Check the response status and handle accordingly
      if (response.status === 201) {
        // Handle successful registration
        setSuccessMessage('Registration successful');
      } else if (response.status === 400) {
        // Handle client-side validation errors, if any
        const data = await response.json();
        setError(data.error);
      } else {
        // Handle other server errors
        setError('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="auth-form-container animated-bg">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
        <input type="hidden" name="_csrf" value={csrfToken} />
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <input
          type="text"
          placeholder="E-Mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p className="alt-action">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
