const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const memoryStore = require('../config/store');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_climate_2026_vasudha'
    );

    let user = null;

    if (mongoose.connection.readyState === 1 && decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      try {
        user = await User.findById(decoded.id);
      } catch (err) {
        user = null;
      }
    }

    if (!user && decoded) {
      user = memoryStore.users.find(
        (u) =>
          String(u._id) === String(decoded.id) ||
          String(u.id) === String(decoded.id) ||
          (decoded.email && u.email.toLowerCase() === decoded.email.toLowerCase())
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account no longer exists',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Your admin account has been disabled. Please contact Super Admin.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token',
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user ? req.user.role : 'none'}' is not authorized to perform this action`,
      });
    }
    next();
  };
};
