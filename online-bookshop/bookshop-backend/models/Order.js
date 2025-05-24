// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      id: String,
      title: String,
      authors: [String],
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    email: String,
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    phone: String
  },
  shippingMethod: {
    name: String,
    price: Number
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Bank Deposit'],
    required: true
  },
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
