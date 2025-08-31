const rateLimit = require('express-rate-limit');

// General rate limiter for all requests (2 minutes window)
const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 2 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (2 minutes window)
const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 2 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Even stricter limiter for registration (2 minutes window)
const registerLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 3 account creations per 2 minutes
  message: {
    error: 'Too many accounts created from this IP, please try again after 2 minutes'
  },
});

// Review submission limiter (2 minutes window)
const reviewLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10, // Limit each IP to 10 review submissions per 2 minutes
  message: {
    error: 'Too many reviews submitted from this IP, please try again after 2 minutes'
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  reviewLimiter
};