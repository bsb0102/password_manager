// frontend/src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AuthForm.css'; // Unified CSS for both login and register

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State to handle success message
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setError(''); // Clear any previous errors
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/auth/register`, {
          username,
          password,
        });
        // Set success message and handle post-registration logic
        console.log(response.data)
        setSuccessMessage('Registration successful! You can now login.');
        setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
      } catch (error) {
        // Handle registration failure
        setError('Registration failed. Please try again.');
      }
    };
  
    return (
      <div className="auth-form-container">
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        <input
          type="text"
          placeholder="Username"
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
