import React, { useState, useEffect } from "react";
import '../styles/PasswordManager.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import axiosInstance from '../api/api.js';

const PasswordManager = () => {
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [inputBackgroundColor, setInputBackgroundColor] = useState("white");
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    id: "",
    website: "",
    email: "",
    username: "",
    password: "",
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showGenerateStrongPassword, setShowGenerateStrongPassword] = useState(false);
  const [secretKey] = useState("1b6f0bb9a4f7ded7c70543378c49464f");
  const [decryptedPassword, setDecryptedPassword] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: ""
  });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 5000); // Hide after 5 seconds
  };

  const maskPassword = (encryptedPassword) => '*';

  const fetchPasswords = async () => {
    try {
      const response = await axiosInstance.get('/api/getPasswords');
      setData(response.data.map(item => ({
        ...item,
        showPassword: false // Add a visibility flag for each password
      })));
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);


  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setData(data.map(item => 
      item._id === id ? { ...item, showPassword: !item.showPassword } : item
    ));
  };

  const handleAddPasswordSubmit = async () => {
    try {
      const passwordPayload = {
        website: newPasswordData.website,
        email: newPasswordData.email,
        username: newPasswordData.username,
        password: newPasswordData.password, // send the plain password
      };
  
      let response;
      if (editData) {
        console.log("Updating Password: ", passwordPayload)
        response = await axiosInstance.put(`/api/updatePassword/${editData._id}`, passwordPayload);
        showNotification("Password updated successfully...");
      } else {
        // Add new item
        console.log("Adding new password: ", passwordPayload)
        response = await axiosInstance.post('/api/addPassword', passwordPayload);
        showNotification("Password added successfully...");
      }
  
      // Fetch updated list of passwords
      fetchPasswords();
      setShowAddPasswordModal(false);
      setEditData(null);
      setNewPasswordData({ id: "", website: "", email: "", username: "", password: "" }); // Reset the form
    } catch (error) {
      console.error('Error adding/updating password:', error);
    }
  };



  const handleAddClick = () => {
    setShowAddPasswordModal(true);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setNewPasswordData({
      id: item._id,
      website: item.website,
      email: item.email,
      username: item.username,
      password: item.password // Use the decrypted password directly
    });
    setShowAddPasswordModal(true);
  };

  const handleDeleteClick = (id) => {
    console.log("Preparing to delete ID:", id); // Add this log to confirm the received ID
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleDeletePassword(deleteId);
    } catch (error) {
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteId(null);
    }
  };
  
  const handleDeletePassword = async (id) => {
    if (id) {
      try {
        await axiosInstance.delete(`/api/deletePassword/${id}`);
        setData(data.filter((item) => item._id !== id)); // Make sure to match the ID key used in your data items
        showNotification("Password deleted successfully...");
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    } else {
      console.log("No ID provided for deletion");
    }
  };

  const decrypt = async (passwordId) => {
    try {
      // Send a request to the backend with the password ID
      const response = await axiosInstance.get(`/api/decryptPasswordById`, {
        params: { id: passwordId }
      });
      const decryptedPassword = response.data.decryptedPassword;
      console.log(decryptedPassword);
      setDecryptedPassword(decryptedPassword);
    } catch (error) {
      console.error('Error decrypting password:', error);
    }
};

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteId(null);
  };

  const handleGenerateStrongPasswordChange = () => {
    if (!showGenerateStrongPassword) {
      // Generate a strong password and populate the input field
      const generatedPassword = generateStrongPassword();
      setNewPasswordData({ ...newPasswordData, password: generatedPassword });
      setInputBackgroundColor('gray');
    } else {
      // Clear the password input field
      setNewPasswordData({ ...newPasswordData, password: '' });
      setInputBackgroundColor('white');
    }

    setShowPassword(false);
    setShowGenerateStrongPassword(!showGenerateStrongPassword);
  };

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  };

  const handleAddPasswordModalClose = () => {
    setShowAddPasswordModal(false);
    setEditData(null);
    setNewPasswordData({
      id: "",
      website: "",
      email: "",
      username: "",
      password: "",
    });
    setShowGenerateStrongPassword(false);
  };


  return (
    <div className="table-container">
      <div className="table-box">
        <button onClick={handleAddClick} className="add-button">+</button>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Website</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.website}</td>
                <td>{item.email}</td>
                <td>{item.username}</td>
                <td>
                  {item.showPassword ? (
                    <>
                      {item.password} {/* Display decrypted password */}
                      <button onClick={() => togglePasswordVisibility(item._id)} className="password-toggle">
                        <FaEyeSlash /> {/* Hide icon */}
                      </button>
                    </>
                  ) : (
                    <>
                      {maskPassword(item.password)} {/* Mask with asterisks */}
                      <button onClick={() => togglePasswordVisibility(item._id)} className="password-toggle">
                        <FaEye /> {/* Show icon */}
                      </button>
                    </>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditClick(item)} className="edit-button">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteClick(item._id)} className="delete-button">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notification.show && (
        <div className={`notification ${notification.show ? 'show' : ''}`}>
          {notification.message}
          <span className="notification-close" onClick={() => setNotification({ show: false, message: "" })}>
            ×
          </span>
        </div>
      )}
      
      {showAddPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editData ? "Edit Password" : "Add Password"}</h2>
            <label className="filled">ID:
              <input
                type="text"
                value={newPasswordData.id}
                readOnly
              />
            </label>
            <label>Website:
              <input
                type="text"
                value={newPasswordData.website || (editData ? editData.website : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, website: e.target.value })}
              />
            </label>
            <label>Email:
              <input
                type="text"
                value={newPasswordData.email || (editData ? editData.email : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, email: e.target.value })}
              />
            </label>
            <label>Username:
              <input
                type="text"
                value={newPasswordData.username || (editData ? editData.username : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, username: e.target.value })}
              />
            </label>
            <label>
              Password:
              <div className="password-input">
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPasswordData.password}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                    disabled={showGenerateStrongPassword}
                    style={{ backgroundColor: inputBackgroundColor }}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </span>
                </div>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={showGenerateStrongPassword}
                    onChange={handleGenerateStrongPasswordChange}
                  />
                  Generate Strong Password
                </div>
              </div>
            </label>
            <button onClick={handleAddPasswordSubmit}>{editData ? "Save" : "Submit"}</button>
            <button onClick={handleAddPasswordModalClose}>Cancel</button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <div className="delete-content">
            <p className="confirmation-text">
              Are you sure you want to delete this data?
            </p>
            <button 
            onClick={() => {
              handleDeleteConfirm();
              }}
              className="confirm-button">
              Yes
            </button>
            <button onClick={handleDeleteCancel} className="cancel-button">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordManager;
