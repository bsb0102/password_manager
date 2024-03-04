// secretNoteController.js

const SecretNote = require('../models/SecretNotes');
const { generateRandomIV, encrypt, decrypt, getUserIdFromToken } = require('../models/cryptoUtils');
require('dotenv').config();


exports.addSecretNote = async (req, res) => {
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
    
        const newSecretNote = new SecretNote({
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
    
        await newSecretNote.save();
        res.status(201).json({ message: "Secret node saved successfully." });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };


exports.getSecretNotes = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);
    const SecretNotes = await SecretNote.find({ userId });
    res.status(200).json(SecretNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSecretNote = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    // Check if the secret node belongs to the user
    const secretNote = await SecretNote.findById(id);
    if (!secretNote || secretNote.userId.toString() !== userId) {
      return res.status(404).json({ error: "Secret node not found or access denied" });
    }

    await SecretNote.findByIdAndDelete(id);
    res.status(200).json({ message: "Secret node deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSecretNote = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, passphrase } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      const userId = getUserIdFromToken(token);
  
      // Check if the secret node belongs to the user
      const secretNote = await SecretNote.findById(id);
      if (!secretNote || secretNote.userId.toString() !== userId) {
        return res.status(404).json({ error: "Secret node not found or access denied" });
      }
  
      // Generate random IVs for encryption for both content and passphrase
      const ivContent = generateRandomIV();
      const ivPassphrase = generateRandomIV();
  
      // Encrypt content and passphrase
      const encryptedContent = encrypt(content, ivContent); // 
      const encryptedPassphrase = encrypt(passphrase, ivPassphrase); // 

      // Update the secret node with the new encrypted content and passphrase
      await SecretNote.findByIdAndUpdate(id, {
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
  
  exports.openSecretNote = async (req, res) => {
    try {
      const { id } = req.params; 
      const { passphrase } = req.body; // Passphrase from the client
      const token = req.headers.authorization.split(' ')[1];
      const userId = getUserIdFromToken(token);
  
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
  
      const secretNote = await SecretNote.findById(id);
      if (!secretNote) {
        return res.status(404).json({ error: "Secret node not found" });
      }

      if (secretNote.userId.toString() !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const decryptedPassphrase = decrypt(secretNote.encryptedPassphrase.content, secretNote.encryptedPassphrase.iv);
      if (passphrase !== decryptedPassphrase) {
        return res.status(401).json({ error: "Incorrect passphrase" });
      }
  
      const decryptedContent = decrypt(secretNote.encryptedContent.content, secretNote.encryptedContent.iv);
      res.json({ content: decryptedContent });
    } catch (error) {
      console.error("Error opening secret node:", error);
      res.status(500).json({ error: error.message });
    }
  };