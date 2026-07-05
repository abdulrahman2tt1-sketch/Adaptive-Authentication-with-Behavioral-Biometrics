const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { register, login, verifyOTP, sendReverifyOTP } = require('../controllers/authController');

// Auth middleware for protected routes
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/send-reverify-otp', authMiddleware, sendReverifyOTP);

module.exports = router;
