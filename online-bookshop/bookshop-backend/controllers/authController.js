require('dotenv').config();
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/profileModel');


console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Secret key for encryption/decryption (you should store this securely)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ; // Use a strong key in production

// Register new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'Username or email already exists' });

    // Encrypt the password before saving
    const encryptedPassword = crypto.AES.encrypt(password, ENCRYPTION_KEY).toString();

    // Create and save the new user with encrypted password
    const newUser = new User({ username, email, password: encryptedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
    await Profile.create({
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Login user
const loginUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if either email or username exists
    const user = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Decrypt the stored password using the same encryption key
    const bytes = crypto.AES.decrypt(user.password, ENCRYPTION_KEY);
    const decryptedPassword = bytes.toString(crypto.enc.Utf8);

    // Compare decrypted password with entered password
    if (decryptedPassword !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser };
