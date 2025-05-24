// routes/orderRoute.js
const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/create', authenticateJWT, orderController.createOrder);

module.exports = router;
