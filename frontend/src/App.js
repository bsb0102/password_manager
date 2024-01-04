import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar'; // Sidebar component
import './styles/Sidebar.css'; // Updated import name
import ProtectedRoute from './components/ProtectedRoute';
import PasswordManager from './components/PasswordManager';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PasswordManager />
              </ProtectedRoute>
            }
          />

          {/* Settings route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Add any other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
