const express = require('express');
const { getApprovals } = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('superadmin', 'admin'), getApprovals);

module.exports = router;
