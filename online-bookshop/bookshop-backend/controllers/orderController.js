// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware
    const {
      cartItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      totalPrice
    } = req.body;

    const newOrder = new Order({
      userId,
      items: cartItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order', error: err });
  }
};
