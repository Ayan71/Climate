const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getActivityLogs,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/activity-logs', authorize('superadmin'), getActivityLogs);

module.exports = router;
