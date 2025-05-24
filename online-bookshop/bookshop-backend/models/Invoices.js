// models/Invoice.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
    orderId: String,    
    books: Array,
    totalAmount: Number,
    filePath: String,
    createdAt: {
    type: Date,
    default: Date.now
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
