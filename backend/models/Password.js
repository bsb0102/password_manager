const mongoose = require('mongoose');

// Define the schema for the password
const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming userId is an ObjectId
        required: true,
        ref: 'User' // If you have a User model, to create a reference
    },
    website: {
        type: String,
        required: false,
        trim: true
    },
    username: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    encryptedPassword: { // Store the encrypted password
        iv: { type: String, required: true }, // The IV for the encrypted password
        content: { type: String, required: true } // The encrypted content
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema
const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
