const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: String,
    userEmail: String,
    userRole: String,
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    ip: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
