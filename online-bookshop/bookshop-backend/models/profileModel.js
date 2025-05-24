// models/profileModel.js
const mongoose = require('mongoose');

// Schema for the Profile model
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  // Add more fields for profile as needed, like address, phone, etc.
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
