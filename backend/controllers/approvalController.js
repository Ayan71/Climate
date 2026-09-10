const Approval = require('../models/Approval');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');

// @desc    Get approval history
// @route   GET /api/approvals
// @access  Private (SuperAdmin / Admin)
exports.getApprovals = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const approvals = await Approval.find()
        .populate('dataset', 'title domain status')
        .populate('reviewedBy', 'name email role')
        .sort('-createdAt');

      return res.status(200).json({
        success: true,
        count: approvals.length,
        approvals,
      });
    }

    res.status(200).json({
      success: true,
      count: memoryStore.approvals ? memoryStore.approvals.length : 0,
      approvals: memoryStore.approvals || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
