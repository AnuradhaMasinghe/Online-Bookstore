const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

module.exports = router;
