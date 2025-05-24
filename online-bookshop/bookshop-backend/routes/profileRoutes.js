// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');  // JWT authentication middleware
const profileController = require('../controllers/profileController');

// Route to get user profile
router.get('/profile', authenticateJWT, profileController.getProfile);

module.exports = router;
