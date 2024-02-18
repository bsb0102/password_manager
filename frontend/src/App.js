import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Settings from './components/Settings/Settings';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import { AlertProvider } from './components/Alert/AlertService'; // Importiere den AlertProvider

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
        <AlertProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Geschützte Routen */}
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
            {/* Füge hier weitere Routen hinzu */}
          </Routes>
        </AlertProvider>
      </div>
    </Router>
  );
};

export default App;
