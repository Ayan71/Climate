const Dataset = require('../models/Dataset');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');

// @desc    Get all published datasets for Landing Page (Order of Approval)
// @route   GET /api/public
// @access  Public
exports.getPublicLandingData = async (req, res) => {
  try {
    const { search, chartType } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'approved' };
      if (chartType) query.chartType = chartType;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } },
        ];
      }
      const datasets = await Dataset.find(query)
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        count: datasets.length,
        datasets,
      });
    }

    // Memory Store Fallback
    let list = memoryStore.datasets.filter(d => d.status === 'approved');

    if (chartType) {
      list = list.filter(d => d.chartType === chartType);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        (d.domain && d.domain.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({
      success: true,
      count: list.length,
      datasets: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get published Climate datasets
// @route   GET /api/public/climate
// @access  Public
exports.getPublicClimateData = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const datasets = await Dataset.find({ status: 'approved', domain: 'Climate' })
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Climate',
        count: datasets.length,
        datasets,
      });
    }

    const list = memoryStore.datasets
      .filter(d => d.status === 'approved' && d.domain === 'Climate')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({
      success: true,
      domain: 'Climate',
      count: list.length,
      datasets: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get published Energy datasets
// @route   GET /api/public/energy
// @access  Public
exports.getPublicEnergyData = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const datasets = await Dataset.find({ status: 'approved', domain: 'Energy' })
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Energy',
        count: datasets.length,
        datasets,
      });
    }

    const list = memoryStore.datasets
      .filter(d => d.status === 'approved' && d.domain === 'Energy')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({
      success: true,
      domain: 'Energy',
      count: list.length,
      datasets: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get published Power datasets
// @route   GET /api/public/power
// @access  Public
exports.getPublicPowerData = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const datasets = await Dataset.find({ status: 'approved', domain: 'Power' })
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Power',
        count: datasets.length,
        datasets,
      });
    }

    const list = memoryStore.datasets
      .filter(d => d.status === 'approved' && d.domain === 'Power')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({
      success: true,
      domain: 'Power',
      count: list.length,
      datasets: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single published dataset detail
// @route   GET /api/public/:id
// @access  Public
exports.getPublicDatasetById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dataset = await Dataset.findOne({ _id: req.params.id, status: 'approved' }).populate(
        'uploadedBy',
        'name'
      );

      if (!dataset) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found or not published',
        });
      }

      return res.status(200).json({
        success: true,
        dataset,
      });
    }

    const dataset = memoryStore.datasets.find(
      d => (d._id === req.params.id || d.id === req.params.id) && d.status === 'approved'
    );

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found or not published',
      });
    }

    res.status(200).json({
      success: true,
      dataset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
