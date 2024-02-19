// secretNodeController.js

const SecretNode = require('../models/SecretNodes');
const { generateRandomIV, encrypt, decrypt } = require('../models/cryptoUtils');
require('dotenv').config();


exports.addSecretNode = async (req, res) => {
    try {
        const { title, content, passphrase } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(token);
  
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
    
        // Generate random IVs for encryption
        const ivContent = generateRandomIV();
        const ivPassphrase = generateRandomIV();
    
        // Encrypt content and passphrase
        const encryptedContent = encrypt(content, ivContent);
        const encryptedPassphrase = encrypt(passphrase, ivPassphrase);
    
        const newSecretNode = new SecretNode({
            userId,
            title,
            encryptedContent: {
                iv: encryptedContent.iv,
                content: encryptedContent.content
            },
            encryptedPassphrase: {
                iv: encryptedPassphrase.iv,
                content: encryptedPassphrase.content
            }
        });
    
        await newSecretNode.save();
        res.status(201).json({ message: "Secret node saved successfully." });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };


exports.getSecretNodes = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);
    const secretNodes = await SecretNode.find({ userId });
    res.status(200).json(secretNodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSecretNode = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    // Check if the secret node belongs to the user
    const secretNode = await SecretNode.findById(id);
    if (!secretNode || secretNode.userId.toString() !== userId) {
      return res.status(404).json({ error: "Secret node not found or access denied" });
    }

    await SecretNode.findByIdAndDelete(id);
    res.status(200).json({ message: "Secret node deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSecretNode = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, passphrase } = req.body;
      const userId = req.user.id;
  
      // Check if the secret node belongs to the user
      const secretNode = await SecretNode.findById(id);
      if (!secretNode || secretNode.userId.toString() !== userId) {
        return res.status(404).json({ error: "Secret node not found or access denied" });
      }
  
      // Generate random IVs for encryption for both content and passphrase
      const ivContent = generateRandomIV();
      const ivPassphrase = generateRandomIV();
  
      // Encrypt content and passphrase
      const encryptedContent = encrypt(content, ivContent); // 
      const encryptedPassphrase = encrypt(passphrase, ivPassphrase); // 
  
      // Update the secret node with the new encrypted content and passphrase
      await SecretNode.findByIdAndUpdate(id, {
        title,
        encryptedContent: {
          iv: encryptedContent.iv, // 
          content: encryptedContent.content // 
        },
        encryptedPassphrase: {
          iv: encryptedPassphrase.iv, // 
          content: encryptedPassphrase.content // 
        }
      });
  
      res.status(200).json({ message: "Secret node updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.openSecretNode = async (req, res) => {
    try {
      const { id } = req.params; 
      const { passphrase } = req.body; // Passphrase from the client
      const token = req.headers.authorization.split(' ')[1];
      const userId = getUserIdFromToken(token);
  
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
  
      const secretNode = await SecretNode.findById(id);
      if (!secretNode) {
        return res.status(404).json({ error: "Secret node not found" });
      }

      if (secretNode.userId.toString() !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const decryptedPassphrase = decrypt(secretNode.encryptedPassphrase.content, secretNode.encryptedPassphrase.iv);
      if (passphrase !== decryptedPassphrase) {
        return res.status(401).json({ error: "Incorrect passphrase" });
      }
  
      const decryptedContent = decrypt(secretNode.encryptedContent.content, secretNode.encryptedContent.iv);
      res.json({ content: decryptedContent });
    } catch (error) {
      console.error("Error opening secret node:", error);
      res.status(500).json({ error: error.message });
    }
  };