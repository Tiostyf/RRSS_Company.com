// Add error handling to login and register routes
router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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