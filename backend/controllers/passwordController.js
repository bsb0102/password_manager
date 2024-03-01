const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const { generateRandomIV, encrypt, decrypt, getUserIdFromToken } = require('../models/cryptoUtils'); // Adjust the path as necessary
require('dotenv').config();


const secretKey = process.env.SECRET_KEY;



exports.addPassword = async (req, res) => {
  try {
    const { website, username, password: plainPassword, email } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // Generate a random IV
    const iv = generateRandomIV();

    // Encrypt the password with the IV
    const encryptedPassword = encrypt(plainPassword, iv);

    const newPassword = new Password({
      userId,
      website,
      username,
      email,
      encryptedPassword,
      iv: iv.toString('hex') // Store the IV as a hexadecimal string
    });

    await newPassword.save();
    res.status(201).json({ message: "Password saved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all passwords for a user

exports.getPasswords = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(token);

        if (!userId) {
            return res.status(401).json({ error: "Invalid or missing token" });
        }

        const passwords = await Password.find({ userId });

        // Decrypt each password before sending it back
        const decryptedPasswords = passwords.map(p => {
          const decrypted = decrypt(p.encryptedPassword.content, p.encryptedPassword.iv);
          if (decrypted) {
            return { ...p.toObject(), password: decrypted }; // Include the decrypted password
          } else {
            console.error('Failed to decrypt password for entry:');
            return p;
          }
        });

        res.status(200).json(decryptedPasswords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deletePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer TOKEN'
        const userId = getUserIdFromToken(token);

        if (!userId) {
            return res.status(401).json({ error: "Invalid or missing token" });
        }

        // Check if the password belongs to the user
        const password = await Password.findById(id);
        if (!password || password.userId.toString() !== userId) {
            return res.status(404).json({ error: "Password not found or access denied" });
        }

        // Decrypt the password using IV before deleting it
        const decryptedPassword = decrypt(password.encryptedPassword.content, secretKey, Buffer.from(password.encryptedPassword.iv, 'hex'));

        // Check if decryption was successful
        if (!decryptedPassword) {
            return res.status(500).json({ error: "Error decrypting the password" });
        }

        // Continue with password deletion
        await Password.findByIdAndDelete(id);
        res.status(200).json({ message: "Password deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password: plainPassword, website, email, username } = req.body; // Include other fields in the request body
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // Check if at least one of the fields (password, website, email, username) is provided
    if (!plainPassword && !website && !email && !username) {
      return res.status(400).json({ error: "At least one field (password, website, email, username) is required" });
    }

    // Initialize update object with fields to be updated
    const updateObject = {};

    // Check and update password field
    if (plainPassword) {
      const iv = await generateRandomIV();
      const encryptedPassword = await encrypt(plainPassword, iv);
      updateObject["encryptedPassword.content"] = encryptedPassword['content'];
      updateObject["encryptedPassword.iv"] = iv.toString('hex');
    }

    // Update other fields if provided
    if (website) {
      updateObject.website = website;
    }
    if (email) {
      updateObject.email = email;
    }
    if (username) {
      updateObject.username = username;
    }

    // Update the password entry with the updateObject
    const updatedPassword = await Password.findByIdAndUpdate(id, updateObject, { new: true });

    if (!updatedPassword) {
      return res.status(404).json({ error: "Password not found or access denied" });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
