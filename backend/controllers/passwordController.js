const bcrypt = require('bcrypt');
const Password = require('../models/Password');
const jwt = require('jsonwebtoken');

// Function to extract user ID from the JWT token
const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};

// Add a new password
exports.addPassword = async (req, res) => {
    try {
        const { website, username, password } = req.body;
        const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer TOKEN'
        const userId = getUserIdFromToken(token);

        if (!userId) {
            return res.status(401).json({ error: "Invalid or missing token" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newPassword = new Password({
            userId,
            website,
            username,
            encryptedPassword
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
        const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer TOKEN'
        const userId = getUserIdFromToken(token);

        if (!userId) {
            return res.status(401).json({ error: "Invalid or missing token" });
        }

        const passwords = await Password.find({ userId });
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a password
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

        await Password.findByIdAndDelete(id);
        res.status(200).json({ message: "Password deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
