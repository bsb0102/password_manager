import React, { useState, useEffect } from "react";
import '../styles/PasswordManager.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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

  const maskPassword = (encryptedPassword) => '*';

  const fetchPasswords = async () => {
    try {
      const response = await axiosInstance.get('/api/getPasswords');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const togglePasswordVisibility = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddClick = () => {
    setShowAddPasswordModal(true);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setShowAddPasswordModal(true);
  };

  const handleDeleteClick = (id) => {
    console.log("Preparing to delete ID:", id); // Add this log to confirm the received ID
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Attempting to delete ID:", deleteId);
    try {
      await handleDeletePassword(deleteId);
      console.log("Delete request sent for ID:", deleteId);
    } catch (error) {
      console.error('Error deleting password:', error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteId(null);
    }
  };
  
  const handleDeletePassword = async (id) => {
    if (id) {
      try {
        console.log("Deleting item with ID:", id);
        await axiosInstance.delete(`/api/deletePassword/${id}`);
        setData(data.filter((item) => item._id !== id)); // Make sure to match the ID key used in your data items
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    } else {
      console.log("No ID provided for deletion");
    }
  };

  const decrypt = async (encryptedPassword) => {
    try {
      const response = await axiosInstance.get(`/api/decryptPassword?encryptedPassword=${encryptedPassword}`);
      const decryptedPassword = response.data;
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

  const handleAddPasswordSubmit = async () => {
    try {
      if (editData) {
        // Handle edit logic here (update the existing item).
        await axiosInstance.put(`/api/updatePassword/${editData.id}`, newPasswordData);
      } else {
        // Handle add logic here (add a new item).
        const response = await axiosInstance.post('/api/addPassword', newPasswordData);
        setData([...data, response.data]);
      }
      setShowAddPasswordModal(false);
      setEditData(null);
    } catch (error) {
      console.error('Error adding/updating password:', error);
    }
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
                  {showPassword[item._id] ? (
                    <>
                      {decryptedPassword ? decryptedPassword : 'Decrypting...'} {/* Show 'Decrypting...' while decrypting */}
                      <button onClick={() => togglePasswordVisibility(item._id)}>
                        Hide
                      </button>
                    </>
                  ) : (
                    <>
                      {maskPassword(item.encryptedPassword)} {/* Mask with asterisks */}
                      <button onClick={() => togglePasswordVisibility(item._id)}>
                        Show
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
                    value={newPasswordData.password || (editData ? decrypt(editData.encryptedPassword) : '')}
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
