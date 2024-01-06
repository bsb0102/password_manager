const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const { generateRandomIV, encrypt, decrypt } = require('../models/cryptoUtils'); // Adjust the path as necessary
require('dotenv').config();


const secretKey = process.env.SECRET_KEY;

getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

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
    const { password: plainPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    // Check if the password field is provided
    if (!plainPassword) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Generate a new random IV for the new password
    const iv = await generateRandomIV();
    const encryptedPassword = await encrypt(plainPassword, iv);

    // Update the password entry with only the password field
    const updatedPassword = await Password.findByIdAndUpdate(id, {
      "encryptedPassword.content": encryptedPassword['content'],
      "encryptedPassword.iv": iv.toString('hex')
    }, { new: true });
    

    if (!updatedPassword) {
      return res.status(404).json({ error: "Password not found or access denied" });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};