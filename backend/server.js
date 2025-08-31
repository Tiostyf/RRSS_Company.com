const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables based on environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const authRoutes = require('./routes/auth');
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  reviewLimiter
} = require('./middleware/rateLimit');

const app = express();

// Middleware - CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "https://rrss-company-com.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Apply rate limiting to all requests
app.use(generalLimiter);

// Apply specific rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Protected routes
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/service.html'));
});

app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/review.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));