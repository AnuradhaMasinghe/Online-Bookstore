const Cart = require('../models/Cart');

// Add item to cart

exports.addToCart = async (req, res) => {
  try {
    const { bookId, title, price, quantity, image } = req.body;
    const userId = req.userId; // From authenticateJWT middleware

    // Check if cart already exists
    let cart = await Cart.findOne({ userId });

    const newItem = { bookId, title, price, quantity, image };

    if (cart) {
      // Check if the item already exists
      const existingItemIndex = cart.items.findIndex(item => item.bookId === bookId);

      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push(newItem);
      }

      await cart.save();
    } else {
      // Create new cart with first item
      cart = new Cart({
        userId,
        items: [newItem]
      });
      await cart.save();
    }

    res.status(201).json({ message: 'Book added to cart successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart', error: err });
  }
};

// controllers/cartController.js
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from the JWT by middleware
    const cart = await Cart.findOne({ userId }); // Filter by logged-in user's ID

    if (!cart) {
      return res.status(404).json({ message: 'No cart found for this user' });
    }

    res.status(200).json(cart.items); // Return only this user's cart items
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Remove a specific item from a user's cart
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.userId; // from authenticated middleware
    const { itemId } = req.params; // This is the ID of the book item to remove

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};
// Update quantity of a cart item
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity', error: err.message });
  }
};
