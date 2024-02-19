const mongoose = require('mongoose');

// Define the schema for the secret nodes
const secretNodeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    encryptedContent: {
        content: { type: String, required: true }, // The encrypted content
        iv: { type: String, required: true } // The IV for the encrypted content
    },
    encryptedPassphrase: {
        content: { type: String, required: true }, // The encrypted passphrase
        iv: { type: String, required: true } // The IV for the encrypted passphrase
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema
const SecretNode = mongoose.model('SecretNode', secretNodeSchema);

module.exports = SecretNode;
