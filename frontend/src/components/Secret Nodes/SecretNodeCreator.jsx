import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/api.js';

function SecretNodeCreator() {
  const [secretNodes, setSecretNodes] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');

  useEffect(() => {
    fetchSecretNodes();
  }, []);

  const fetchSecretNodes = async () => {
    try {
      const response = await axiosInstance.get('/api/getSecretNodes');
      setSecretNodes(response.data);
    } catch (error) {
      console.error('Error fetching secret nodes:', error);
    }
  };

  const addSecretNode = async () => {
    try {
      const response = await axiosInstance.post('/api/addSecretNode', {
        title: newNodeTitle,
        content: newNodeContent,
        passphrase: passphrase
      });
      console.log('Secret node added:', response.data);
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
      await axiosInstance.delete(`/api/deleteSecretNode/${id}`, {
        headers: {
          Passphrase: passphrase
        }
      });
      console.log('Secret node deleted');
      fetchSecretNodes();
    } catch (error) {
      console.error('Error deleting secret node:', error);
    }
  };

  const openSecretNode = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/openSecretNode/${id}`, {
        headers: {
          Passphrase: passphrase
        }
      });
      console.log('Opened secret node:', response.data);
      setSelectedNodeId(id);
    } catch (error) {
      console.error('Error opening secret node:', error);
    }
  };

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
        ></textarea>
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
        <ul>
          {secretNodes.map((node) => (
            <li key={node._id}>
              <h3 onClick={() => openSecretNode(node._id)}>{node.title}</h3>
              {selectedNodeId === node._id && <p>{node.content}</p>}
              <button onClick={() => deleteSecretNode(node._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SecretNodeCreator;
