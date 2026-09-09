const express = require('express');
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
