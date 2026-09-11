const bcrypt = require('bcrypt');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');
const { sendAdminWelcomeEmail } = require('../utils/mailer');

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Private/SuperAdmin
exports.getAdmins = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const admins = await User.find({ role: 'admin' }).sort('-createdAt');
      return res.status(200).json({
        success: true,
        count: admins.length,
        admins,
      });
    }

    const admins = memoryStore.users.filter(u => u.role === 'admin');
    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new Admin account
// @route   POST /api/admin/users
// @access  Private/SuperAdmin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password for the Admin account',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (memoryStore.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminObjectId = new mongoose.Types.ObjectId();
    const adminIdStr = adminObjectId.toString();

    const newAdmin = {
      _id: adminIdStr,
      id: adminIdStr,
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
    };

    memoryStore.users.push(newAdmin);

    if (mongoose.connection.readyState === 1) {
      await User.create({
        _id: adminObjectId,
        name,
        email: cleanEmail,
        password,
        role: 'admin',
        isActive: true,
      });
    }

    // Send welcome email notification with credentials
    await sendAdminWelcomeEmail(newAdmin.email, newAdmin.name, password);

    memoryStore.activityLogs.push({
      _id: 'log_' + Date.now(),
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'CREATE_ADMIN',
      details: `Created new admin account for ${newAdmin.name} (${newAdmin.email})`,
      ip: req.ip,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
      },
      message: 'Admin account created successfully. Welcome email sent.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update Admin details
// @route   PUT /api/admin/users/:id
// @access  Private/SuperAdmin
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = memoryStore.users.find(u => (u._id === req.params.id || u.id === req.params.id) && u.role === 'admin');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found',
      });
    }

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase().trim();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      let dbAdmin = await User.findById(req.params.id);
      if (dbAdmin) {
        if (name) dbAdmin.name = name;
        if (email) dbAdmin.email = email.toLowerCase().trim();
        if (password) dbAdmin.password = password;
        await dbAdmin.save();
      }
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
      message: 'Admin updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Toggle Admin active/disabled status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/SuperAdmin
exports.toggleAdminStatus = async (req, res) => {
  try {
    const admin = memoryStore.users.find(u => (u._id === req.params.id || u.id === req.params.id) && u.role === 'admin');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found',
      });
    }

    admin.isActive = !admin.isActive;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      let dbAdmin = await User.findById(req.params.id);
      if (dbAdmin) {
        dbAdmin.isActive = admin.isActive;
        await dbAdmin.save();
      }
    }

    res.status(200).json({
      success: true,
      isActive: admin.isActive,
      message: `Admin account has been ${admin.isActive ? 'enabled' : 'disabled'}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete Admin account
// @route   DELETE /api/admin/users/:id
// @access  Private/SuperAdmin
exports.deleteAdmin = async (req, res) => {
  try {
    const index = memoryStore.users.findIndex(u => (u._id === req.params.id || u.id === req.params.id) && u.role === 'admin');

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found',
      });
    }

    const admin = memoryStore.users[index];
    memoryStore.users.splice(index, 1);

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      let dbAdmin = await User.findById(req.params.id);
      if (dbAdmin) {
        await dbAdmin.deleteOne();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Admin account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
