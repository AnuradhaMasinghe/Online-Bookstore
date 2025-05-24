// backend/models/CartItem.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  bookId: { type: String, required: true },
});

module.exports = mongoose.model('CartItem', CartItemSchema);
