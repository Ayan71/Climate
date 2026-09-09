const express = require('express');
const router = express.Router();
const {
  createDataset,
  getDatasets,
  getDatasetById,
  updateDataset,
  deleteDataset,
  approveDataset,
  rejectDataset,
} = require('../controllers/datasetController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getDatasets)
  .post(upload.single('file'), createDataset);

router.route('/:id')
  .get(getDatasetById)
  .put(updateDataset)
  .delete(deleteDataset);

router.patch('/:id/approve', authorize('superadmin'), approveDataset);
router.patch('/:id/reject', authorize('superadmin'), rejectDataset);

module.exports = router;
