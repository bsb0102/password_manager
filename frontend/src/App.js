import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import PasswordManager from './components/PasswordManager';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Sidebar /> {/* Render Sidebar for specific route */}
                <PasswordManager />
              </ProtectedRoute>
            }
          />

          {/* Settings route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Sidebar /> {/* Render Sidebar for specific route */}
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
