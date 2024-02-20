import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Settings from './components/Settings/Settings';
import Dashboard from './components/Dashboard/Dashboard';
import { AlertProvider } from './components/Alert/AlertService';
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage"

const App = () => {
  return (
    <Router>
      <div className="App">
        <AlertProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </AlertProvider>
      </div>
    </Router>
  );
};

export default App;
