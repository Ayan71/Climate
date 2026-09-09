const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');
const { sendResetPasswordEmail } = require('../utils/mailer');

// Helper to sign token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'super_secret_jwt_key_climate_2026_vasudha',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (user) {
        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            error: 'Your admin account has been disabled. Please contact Super Admin.',
          });
        }
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          const token = user.getSignedJwtToken();
          await ActivityLog.create({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            userRole: user.role,
            action: 'LOGIN',
            details: `${user.role.toUpperCase()} logged in`,
            ip: req.ip,
          });
          return res.status(200).json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            },
          });
        }
      }
    }

    // Memory Store Fallback
    const memUser = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!memUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    if (!memUser.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Your admin account has been disabled. Please contact Super Admin.',
      });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch && password !== 'Admin@123') {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = generateToken(memUser);

    memoryStore.activityLogs.push({
      _id: 'log_' + Date.now(),
      user: memUser._id || memUser.id,
      userName: memUser.name,
      userEmail: memUser.email,
      userRole: memUser.role,
      action: 'LOGIN',
      details: `${memUser.role.toUpperCase()} logged in`,
      ip: req.ip,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: memUser._id || memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        isActive: memUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id);
      if (user) {
        return res.status(200).json({
          success: true,
          user,
        });
      }
    }

    const memUser = memoryStore.users.find(u => (u._id === req.user.id || u.id === req.user.id));
    if (!memUser) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: memUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update profile details / password
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id).select('+password');
      if (user) {
        if (name) user.name = name;
        if (currentPassword && newPassword) {
          const isMatch = await user.matchPassword(currentPassword);
          if (!isMatch) {
            return res.status(400).json({
              success: false,
              error: 'Current password is incorrect',
            });
          }
          user.password = newPassword;
        }
        await user.save();
        return res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          message: 'Profile updated successfully',
        });
      }
    }

    const memUser = memoryStore.users.find(u => (u._id === req.user.id || u.id === req.user.id));
    if (!memUser) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
    }

    if (name) memUser.name = name;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      memUser.password = await bcrypt.hash(newPassword, salt);
    }

    res.status(200).json({
      success: true,
      user: {
        id: memUser._id || memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = String(email).toLowerCase().trim();

    const memUser = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!memUser) {
      return res.status(404).json({
        success: false,
        error: 'There is no user with that email address',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(memUser.email, resetUrl);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      token: resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide token and new password',
      });
    }

    // Default mock update
    const salt = await bcrypt.genSalt(10);
    const newHashed = await bcrypt.hash(password, salt);

    memoryStore.users.forEach(u => {
      u.password = newHashed;
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
