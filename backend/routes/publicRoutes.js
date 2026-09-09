const express = require('express');
const router = express.Router();
const {
  getPublicLandingData,
  getPublicClimateData,
  getPublicEnergyData,
  getPublicPowerData,
  getPublicDatasetById,
} = require('../controllers/publicController');

router.get('/', getPublicLandingData);
router.get('/climate', getPublicClimateData);
router.get('/energy', getPublicEnergyData);
router.get('/power', getPublicPowerData);
router.get('/:id', getPublicDatasetById);

module.exports = router;
