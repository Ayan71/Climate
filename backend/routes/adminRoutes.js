const express = require('express');
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('superadmin'));

router.route('/users')
  .get(getAdmins)
  .post(createAdmin);

router.route('/users/:id')
  .put(updateAdmin)
  .delete(deleteAdmin);

router.patch('/users/:id/status', toggleAdminStatus);

module.exports = router;
