import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings/Settings';
import PasswordManager from './components/PasswordManager';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';

// Custom ProtectedRoute component
const ProtectedRoute = ({ element, ...rest }) => {
  // Add your authentication logic here
  const isAuthenticated = true; // Example: Change this based on your authentication state
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <React.Fragment>
                {/* <Sidebar /> */}
                <ProtectedRoute element={<Dashboard />} />
              </React.Fragment>
            }
          />
          <Route
            path="/settings"
            element={
              <React.Fragment>
                <Sidebar />
                <ProtectedRoute element={<Settings />} />
              </React.Fragment>
            }
          />
          {/* Add any other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
