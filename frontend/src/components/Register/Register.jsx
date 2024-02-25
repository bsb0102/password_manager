import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api.js';
import { getCsrfToken } from '../../utils/csrfUtils.js';
import '../Login/AuthForm.css';
import {AlertContext} from '../Alert/AlertService.js';


const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // State to store the CSRF token
  const { setAlert } = useContext(AlertContext);

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
  
    // Validate if the entered username is in email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setAlert("error", "Please enter a valid email address.");
      return;
    }
  
    // Include the CSRF token in the form data
    const data = {
      username: username,
      password: password,
      _csrf: csrfToken,
    };
  
    // Send the POST request with the CSRF token included
    try {
      // Send the registration data to the server
      const registrationResponse = await axiosInstance.post('/api/register', data);
  
      // Check if the registration was successful
      if (registrationResponse.status === 201) {
        // Prompt the user to enter the verification code
        const enteredVerificationCode = prompt("Please enter the verification code sent to your email:");
        const verificationData = {
          username: username,
          verificationCode: enteredVerificationCode,
          password, password,
          _csrf: csrfToken, // Include the CSRF token for verification request
        };

        console.log(verificationData)
  
        // Send the POST request to verify the code
        const verificationResponse = await axiosInstance.post('/api/verifyCode', verificationData);
  
        // Check if the verification was successful
        if (verificationResponse.status === 200) {
          // Handle successful registration and verification
          setAlert("success", "Successfully registered and verified!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {

          setAlert("error", "Verification failed. Please try again.");
        }
      } else if (registrationResponse.status === 400) {

        const responseData = await registrationResponse.json();
        if (responseData.error === "User already exists") {
          setAlert("error", "User with this email already exists.");
        } else {
          setAlert("error", responseData.error);
        }
      } else {
        // Handle other server errors during registration
        setAlert("error", "Failed to Register!");
      }
    } catch (error) {
      console.error('Registration error:', error.request.response);
      setAlert("error", error.request.response);
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
