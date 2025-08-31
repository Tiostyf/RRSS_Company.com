const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const authMiddleware = require('./middleware/auth');
const { generalLimiter, authLimiter, registerLimiter, reviewLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 10000;

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/aiims-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes with specific rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/posts', reviewLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Protected routes - require authentication
app.get('/home', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

app.get('/service', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/service.html'));
});

app.get('/review', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/review.html'));
});

// Error handling middleware for rate limiting
app.use((err, req, res, next) => {
  if (err.statusCode === 429) {
    return res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});