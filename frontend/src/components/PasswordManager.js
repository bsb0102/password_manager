import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/api'; // Adjust this path according to your project structure
import '../styles/PasswordManager.css';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ website: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPasswordId, setEditingPasswordId] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/getPasswords');
      setPasswords(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      setError('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/addPassword', newPassword);
      setPasswords([...passwords, response.data]); // Update the UI optimistically
      setNewPassword({ website: '', username: '', password: '' });
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleEditPassword = async (id, updatedPassword) => {
    try {
      await axiosInstance.put(`/updatePassword/${id}`, updatedPassword);
      setEditingPasswordId(null);
      fetchPasswords();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleDeletePassword = async (id) => {
    try {
      await axiosInstance.delete(`/deletePassword/${id}`);
      setPasswords(passwords.filter(p => p.id !== id)); // Update the UI optimistically
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?[];,./`~';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    setNewPassword({ ...newPassword, password });
  };

  // Render the UI
  return (
    <div className="password-manager-container">
      <nav className="navbar">
        <ul>
          <li>Password Manager</li>
          <li>Settings</li>
        </ul>
      </nav>
      <div className="password-manager">
        {/* Popup for adding or editing passwords */}
        {showAddPopup && (
          <div className="popup-container">
            {/* Add form and popup code here */}
          </div>
        )}
        {/* Password list with animations */}
        <AnimatePresence>
          {passwords.map((password) => (
            <motion.div
              key={password.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="password-entry"
            >
              <div>Website: {password.website}</div>
              <div>Username: {password.username}</div>
              <div>Password: {password.password}</div> {/* Be cautious with displaying passwords */}
              <div className="actions">
                <button onClick={() => setEditingPasswordId(password.id)}>
                  <FaPlus />
                </button>
                <button onClick={() => handleDeletePassword(password.id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PasswordManager;
