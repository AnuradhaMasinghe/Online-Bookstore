// controllers/profileController.js
const Profile = require('../models/profileModel');
const Order = require('../models/Order');  // Assuming you have an Order model

// Function to get profile and related orders
exports.getProfile = async (req, res) => {
    try {
      // Fetch the user profile
      const profile = await Profile.findOne({ userId: req.userId }).select('username email');
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Fetch orders related to the user
      const orders = await Order.find({ userId: req.userId })
        .select('shippingMethod paymentMethod totalPrice items')  // Select the fields we need
        .lean(); // Convert MongoDB documents to plain JavaScript objects for easier manipulation
  
      // Format the orders data
      const formattedOrders = orders.map(order => {
        return {
          orderId: order._id,
          books: order.items.map(item => ({
            title: item.title,
            authors: item.authors,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.totalPrice,
          shippingMethod: order.shippingMethod,
          paymentMethod: order.paymentMethod,
        };
      });
  
      // Send the profile and formatted order details
      res.json({
        username: profile.username,
        email: profile.email,
        orders: formattedOrders,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ message: 'Error fetching profile data' });
    }
  };
  