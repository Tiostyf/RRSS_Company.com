const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables based on environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  reviewLimiter
} = require('./middleware/rateLimit');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Apply rate limiting to all requests
app.use(generalLimiter);

// Apply specific rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Serve frontend pages with optional token validation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Protected routes - check for token
app.get('/home', (req, res, next) => {
  // Check if token exists in query params
  if (req.query.token) {
    // Validate token but don't block access if invalid
    authMiddleware(req, res, () => {
      res.sendFile(path.join(__dirname, '../frontend/home.html'));
    });
  } else {
    // No token, still serve the page - frontend will handle redirection
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
  }
});

app.get('/service', (req, res, next) => {
  if (req.query.token) {
    authMiddleware(req, res, () => {
      res.sendFile(path.join(__dirname, '../frontend/service.html'));
    });
  } else {
    res.sendFile(path.join(__dirname, '../frontend/service.html'));
  }
});

app.get('/review', (req, res, next) => {
  if (req.query.token) {
    authMiddleware(req, res, () => {
      res.sendFile(path.join(__dirname, '../frontend/review.html'));
    });
  } else {
    res.sendFile(path.join(__dirname, '../frontend/review.html'));
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));