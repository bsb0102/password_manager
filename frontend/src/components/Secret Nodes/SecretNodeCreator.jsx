import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/api.js';
import './SecretNodes.css'; // Import CSS file for styling
import Spinner from "../Alert/Spinner";
import {AlertContext} from '../Alert/AlertService.js';

function SecretNodeCreator() {
  const [secretNodes, setSecretNodes] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [addSecretNodeModalOpen, setAddSecretNodeModalOpen] = useState(false);
  const [unlockPassphrase, setUnlockPassphrase] = useState('');
  const [unlockedContent, setUnlockedContent] = useState({});
  const [unlockAttemptFailed, setUnlockAttemptFailed] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertContext);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNodeId, setModalNodeId] = useState(null);
  const [currentPassphrase, setCurrentPassphrase] = useState(null); // Added state for current passphrase
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const toggleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalNodeId(id);
    setUnlockPassphrase('');
  };

  const openAddSecretNodeModal = () => {
    setAddSecretNodeModalOpen(true);
  };

  const closeAddSecretNodeModal = () => {
    setAddSecretNodeModalOpen(false);
  };

  const handleEditClick = (id) => {
    // Check if the note is unlocked before allowing editing
    if (unlockedContent[id]) {
      setEditingNodeId(id);
    } else {
      setAlert("error", "Note must be unlocked to edit.");
    }
  };

  const openDeleteConfirmation = (id) => {
    // Check if the note is unlocked or locked
    if (unlockedContent[id]) {
      // If note is unlocked, directly open delete confirmation modal
      setIsDeleteConfirmationOpen(true);
      setNodeToDelete(id);
    } else {
      // If note is locked, ask for passphrase first
      toggleModal(id);
    }
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false); // Close the delete confirmation modal
    setNodeToDelete(null); // Reset the node to delete
  };
  

  const updateSecretNote = async (id, updatedTitle, updatedContent) => {
    try {
      await axiosInstance.put(`/api/updateSecretNote/${id}`, {
        title: updatedTitle,
        content: updatedContent,
        passphrase: currentPassphrase, // Use the current passphrase
      });
      setAlert("success", "Successfully updated Note!")
    } catch (error) {
      console.error('Error updating secret note:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSecretNodes();
    setPassphrase(null); // Reset passphrase when component mounts
  }, []);

  const fetchSecretNodes = async () => {
    try {
      const response = await axiosInstance.get('/api/getSecretNotes');
      setSecretNodes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching secret nodes:', error);
    }
  };

  const addSecretNode = async () => {
    try {
      await axiosInstance.post('/api/addSecretNote', {
        title: newNodeTitle,
        content: newNodeContent,
        passphrase: passphrase,
      });
      setNewNodeTitle('');
      setNewNodeContent('');
      setPassphrase(null); // Reset passphrase after adding secret node
      fetchSecretNodes();
      closeAddSecretNodeModal();
    } catch (error) {
      console.error('Error adding secret node:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const id = nodeToDelete;
      // Check if the note is unlocked or passphrase is provided before deleting
      if (unlockedContent[id] || unlockPassphrase === currentPassphrase) {
        setLoading(true);
        await axiosInstance.delete(`/api/deleteSecretNote/${id}`);
        const updatedNodes = secretNodes.filter(node => node._id !== id);
        setSecretNodes(updatedNodes);
        setLoading(false);
      } else {
        // If note is locked and passphrase is incorrect, show an error message
        setAlert("error", "Note must be unlocked or passphrase provided to delete.");
      }
    } catch (error) {
      console.error('Error deleting secret node:', error);
    }
    closeDeleteConfirmation();
  };


  const handleUnlockSubmit = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/openSecretNote/${id}`, { passphrase: unlockPassphrase });
      setUnlockedContent(prev => ({ ...prev, [id]: response.data.content }));
      setCurrentPassphrase(unlockPassphrase); // Set current passphrase
      toggleModal();
    } catch (error) {
      console.error('Error unlocking secret node:', error);
      setAlert("error", "Passphrase wrong");
      toggleModal(); 
    }
    setLoading(false);
  };

  const handleLockIconClick = (e, id) => {
    e.stopPropagation();
    if (unlockedContent[id]) {
      setUnlockedContent(prev => {
        const updated = { ...prev };
        delete updated[id];
        setCurrentPassphrase(null); // Reset current passphrase when content is locked
        return updated;
      });
    } else {
      toggleModal(id);
    }
    if (!unlockedContent[id]) {
      toggleModal(id);
    }
  };

  const handleNodeItemClick = (id) => {
    if (!unlockedContent[id]) {
      toggleModal(id);
    }
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  return (
    <div className="App">
      <div className="secret-nodes-container">      
        <button onClick={openAddSecretNodeModal} className="add-button">+</button>
      </div>
      <div>
      <h2>Existing Secret Notes:</h2>
        {secretNodes.length === 0 ? (
          <p>You don't have any secret notes yet.</p>
        ) : (
          <ul className="node-list">
            {secretNodes.map((node) => (
              <div key={node._id} className="node-item" onClick={() => handleNodeItemClick(node._id)}>
                <div className="node-header">
                  <h3>{node.title}</h3>
                  <button className="lock-icon" onClick={(e) => {
                    e.stopPropagation();
                    handleLockIconClick(e, node._id);
                  }}>
                    {unlockedContent[node._id] ? '🔓' : '🔒'}
                  </button>
                </div>
                {unlockedContent[node._id] ? (
                  <div className="textarea-container">
                    <textarea
                      className="node-content"
                      value={unlockedContent[node._id] || newNodeContent}
                      onChange={(e) => setUnlockedContent(prev => ({ ...prev, [node._id]: e.target.value }))}
                      style={{ resize: 'none', height: '150px', width: "320px" }} // Apply inline style
                    ></textarea>
                    <div className="buttons-container">
                      <button onClick={() => updateSecretNote(node._id, node.title, unlockedContent[node._id])}>Save</button>
                      {/* <button onClick={() => handleEditClick(node._id)}>Edit</button> */}
                      <button onClick={(e) => {
                        e.stopPropagation(); 
                        openDeleteConfirmation(node._id);
                      }}>Delete</button>
                    </div>
                  </div>
                ) : (
                  <p className="node-content">Content is locked 🔒</p>
                )}
              </div>
            ))}


          </ul>
        )}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="modal-addnotes-close" onClick={toggleModal}>&times;</span>
            <h2>Enter your Passphrase</h2>
            <input
              type="password"
              placeholder="Enter passphrase"
              value={unlockPassphrase}
              onChange={(e) => setUnlockPassphrase(e.target.value)}
            />
            <button onClick={() => handleUnlockSubmit(modalNodeId)}>Unlock</button>
          </div>
        </div>
      )}

      {addSecretNodeModalOpen && (
          <div className="modal-addnotes">
            <div className="modal-addnotes-content">
              <span className="modal-addnotes-close" onClick={closeAddSecretNodeModal}>&times;</span>
              <h2>Enter Details</h2>
              <input
                type="text"
                placeholder="Title"
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                className="modal-addnotes-input-field"
              />
              <textarea
                placeholder="Content"
                value={newNodeContent}
                onChange={(e) => setNewNodeContent(e.target.value)}
                className="modal-addnotes-input-field content-field"
              />
              <input
                type="password"
                placeholder="Passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="modal-addnotes-input-field passphrase-field"
              />
              <button onClick={addSecretNode} className="modal-addnotes-button">Add Secret Node</button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmationOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeDeleteConfirmation}>&times;</span>
              <h2>Delete Confirmation</h2>
              <p>Are you sure you want to delete this secret note?</p>
              <div className="modal-buttons">
                <button onClick={confirmDelete} className="confirm-button">Confirm</button>
                <button onClick={closeDeleteConfirmation} className="cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default SecretNodeCreator;
