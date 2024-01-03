import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/api'; // Adjust this path according to your project structure
import '../styles/PasswordManager.css';

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ website: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPasswordId, setEditingPasswordId] = useState(null);

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
      await axiosInstance.post('/addPassword', newPassword);
      setNewPassword({ website: '', username: '', password: '' });
      fetchPasswords();
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
      fetchPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  return (
    <div>
      <h1>Password Manager</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleAddPassword}>
        <input 
          type="text" 
          placeholder="Website" 
          value={newPassword.website} 
          onChange={(e) => setNewPassword({...newPassword, website: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Username" 
          value={newPassword.username} 
          onChange={(e) => setNewPassword({...newPassword, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={newPassword.password} 
          onChange={(e) => setNewPassword({...newPassword, password: e.target.value})} 
        />
        <button type="submit">Add Password</button>
      </form>

      <div>
        {passwords.map((password) => (
          <div key={password.id}>
            {editingPasswordId === password.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditPassword(password.id, newPassword);
              }}>
                <input 
                  type="text" 
                  defaultValue={password.website} 
                  onChange={(e) => setNewPassword({...newPassword, website: e.target.value})} 
                />
                <input 
                  type="text" 
                  defaultValue={password.username} 
                  onChange={(e) => setNewPassword({...newPassword, username: e.target.value})} 
                />
                <input 
                  type="password" 
                  defaultValue={password.password} 
                  onChange={(e) => setNewPassword({...newPassword, password: e.target.value})} 
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingPasswordId(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <p>Website: {password.website}</p>
                <p>Username: {password.username}</p>
                <button onClick={() => setEditingPasswordId(password.id)}>Edit</button>
                <button onClick={() => handleDeletePassword(password.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordManager;
