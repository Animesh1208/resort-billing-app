const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

// Admin only routes
router.post('/register', protect, admin, registerUser);

module.exports = router;
