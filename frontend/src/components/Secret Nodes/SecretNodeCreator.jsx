import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/api.js';
import './secretNodes.css'; // Import CSS file for styling
import Spinner from "../Alert/Spinner";
import {AlertContext} from '../Alert/AlertService.js';

function SecretNodeCreator() {
  const [secretNodes, setSecretNodes] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [unlockPassphrase, setUnlockPassphrase] = useState('');
  const [unlockedContent, setUnlockedContent] = useState({});
  const [unlockAttemptFailed, setUnlockAttemptFailed] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertContext)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNodeId, setModalNodeId] = useState(null);

  const toggleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalNodeId(id);
    setUnlockPassphrase('');
  };



  useEffect(() => {
    setLoading(true);
    fetchSecretNodes();
  }, []);

  const fetchSecretNodes = async () => {
    try {
      const response = await axiosInstance.get('/api/getSecretNodes');
      setSecretNodes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching secret nodes:', error);
    }
  };

  const addSecretNode = async () => {
    try {
      await axiosInstance.post('/api/addSecretNode', {
        title: newNodeTitle,
        content: newNodeContent,
        passphrase: passphrase,
      });
      setNewNodeTitle('');
      setNewNodeContent('');
      setPassphrase('');
      fetchSecretNodes();
    } catch (error) {
      console.error('Error adding secret node:', error);
    }
  };

  const deleteSecretNode = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/deleteSecretNode/${id}`);
      const updatedNodes = secretNodes.filter(node => node._id !== id);
      setSecretNodes(updatedNodes);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting secret node:', error);
    }
  };


  const handleUnlockSubmit = async (id) => {
    try {
      const response = await axiosInstance.post(`/api/openSecretNode/${id}`, { passphrase: unlockPassphrase });
      setUnlockedContent(prev => ({ ...prev, [id]: response.data.content }));
      toggleModal(); // Schließt das Modal
    } catch (error) {
      console.error('Error unlocking secret node:', error);
      setAlert("error", "Passphrase wrong");
      toggleModal(); 
    }
  };

  const handleLockIconClick = (id) => {
    if (unlockedContent[id]) {
      setUnlockedContent(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
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
      <h1>Secret Nodes</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newNodeTitle}
          onChange={(e) => setNewNodeTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
        <button onClick={addSecretNode}>Add Secret Node</button>
      </div>
      <div>
        <h2>Existing Secret Nodes:</h2>
        <ul className="node-list">
          {secretNodes.map((node) => (
            <div key={node._id} className="node-item" onClick={() => handleLockIconClick(node._id)}>
              <div className="node-header">
                <h3>{node.title}</h3>
                <button className="lock-icon" onClick={(e) => {
                  e.stopPropagation();
                  handleLockIconClick(node._id);
                }}>
                  {unlockedContent[node._id] ? '🔓' : '🔒'}
                </button>
              </div>
              {unlockedContent[node._id] && (
                <p className="node-content">{unlockedContent[node._id]}</p>
              )}
              <button onClick={(e) => {
                e.stopPropagation();
                deleteSecretNode(node._id);
              }}>Delete</button>
            </div>
          ))}
        </ul>

      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Enter your Passphrase</h2>
            <input
              type="password"
              placeholder="Enter passphrase"
              value={unlockPassphrase}
              onChange={(e) => setUnlockPassphrase(e.target.value)}
            />
            <button onClick={() => handleUnlockSubmit(modalNodeId)}>Unlock</button>
            {/* Optional: Hier könnte die Fehlermeldung angezeigt werden, falls die Passphrase falsch ist. */}
          </div>
        </div>
      )}
    </div>
  );
}

export default SecretNodeCreator;
