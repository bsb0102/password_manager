import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Authentication successful, redirect the user
        navigate('/dashboard'); // Redirect to the dashboard or desired path
      } else {
        // Authentication failed, handle the error (e.g., show an error message)
        const errorMsg = await response.text(); // or response.json() if the server sends JSON
        setError(errorMsg);
      }
    } catch (error) {
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div className="login-panel">
      <h2>Login</h2>
      {error && <div className="error-popup">{error}</div>} {/* Display error message */}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
