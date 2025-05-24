// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const { generateInvoice } = require("../controllers/invoiceController");

router.get("/generate/:orderId", generateInvoice); // GET instead of POST, uses URL param


module.exports = router;
