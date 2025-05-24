const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures each username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures each email is unique
  },
  password: {
    type: String,
    required: true, // Password is required for user authentication
  },
  favorites: [
    {
      bookId: String,
      title: String,      
      
    }
  ]
});

// Create and export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
