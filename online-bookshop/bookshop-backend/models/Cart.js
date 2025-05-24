const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      bookId: String,
      title: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String,
    }
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
