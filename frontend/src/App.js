// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard'; // Assume you have this component
import MainPage from './MainPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onAuthenticated={() => setIsAuthenticated(true)} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<MainPage onAuthenticated={() => setIsAuthenticated(true)} />} />
      </Routes>
    </Router>
  );
}

export default App;
