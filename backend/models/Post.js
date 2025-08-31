const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Create a new post
// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error(error);
    if (error.statusCode === 429) {
      return res.status(429).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;