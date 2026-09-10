const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('superadmin'), createCategory);
router.put('/:id', protect, authorize('superadmin'), updateCategory);
router.delete('/:id', protect, authorize('superadmin'), deleteCategory);

module.exports = router;
