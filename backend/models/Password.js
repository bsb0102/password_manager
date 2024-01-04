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
    password: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema
const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
