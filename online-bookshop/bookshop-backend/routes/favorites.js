const express = require('express');
const axios = require('axios');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const User = require('../models/User');

router.post('/toggle', authenticateJWT, async (req, res) => {
  const { bookId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const book = response.data;
    const bookTitle = book.volumeInfo.title;

    const existingFavorite = user.favorites.find(fav => fav.bookId === bookId);

    let message = '';

    if (existingFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(fav => fav.title !== bookTitle);
      message = 'removed';
    } else {
      // Add to favorites
      user.favorites.push({
        bookId,
        title: bookTitle,
      });
      message = 'added';
    }

    await user.save();

    res.json({ success: true, message, favorites: user.favorites }); // <-- send message
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});


router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || !user.favorites || user.favorites.length === 0) {
      return res.json([]);
    }

    // Return only stored favorites (which include bookId and title)
    res.json(user.favorites); // ✅ This matches frontend expectations
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch favorite books' });
  }
});


module.exports = router;
