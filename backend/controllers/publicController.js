const Dataset = require('../models/Dataset');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');

// Helper function to apply query filters for MongoDB and MemoryStore
const filterDatasets = (list, { search, chartType, category, year, state, district, domain }) => {
  let result = [...list];

  if (domain) {
    result = result.filter(d => d.domain === domain);
  }
  if (chartType) {
    result = result.filter(d => d.chartType === chartType);
  }
  if (category) {
    result = result.filter(d => d.category === category);
  }
  if (year) {
    result = result.filter(d => String(d.year) === String(year));
  }
  if (state) {
    result = result.filter(d => d.state === state);
  }
  if (district) {
    result = result.filter(d => d.district === district);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(d =>
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      (d.domain && d.domain.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.source && d.source.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  result.sort((a, b) => (a.order || 0) - (b.order || 0));
  return result;
};

// @desc    Get all published datasets for Landing Page (Order of Approval)
// @route   GET /api/public
// @access  Public
exports.getPublicLandingData = async (req, res) => {
  try {
    const { search, chartType, category, year, state, district, domain } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'approved' };
      if (domain) query.domain = domain;
      if (chartType) query.chartType = chartType;
      if (category) query.category = category;
      if (year) query.year = year;
      if (state) query.state = state;
      if (district) query.district = district;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { source: { $regex: search, $options: 'i' } },
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

    const approvedList = memoryStore.datasets.filter(d => d.status === 'approved');
    const filteredList = filterDatasets(approvedList, { search, chartType, category, year, state, district, domain });

    res.status(200).json({
      success: true,
      count: filteredList.length,
      datasets: filteredList,
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
    const { search, chartType, category, year, state, district } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'approved', domain: 'Climate' };
      if (chartType) query.chartType = chartType;
      if (category) query.category = category;
      if (year) query.year = year;
      if (state) query.state = state;
      if (district) query.district = district;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const datasets = await Dataset.find(query)
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Climate',
        count: datasets.length,
        datasets,
      });
    }

    const approvedList = memoryStore.datasets.filter(d => d.status === 'approved' && d.domain === 'Climate');
    const filteredList = filterDatasets(approvedList, { search, chartType, category, year, state, district });

    res.status(200).json({
      success: true,
      domain: 'Climate',
      count: filteredList.length,
      datasets: filteredList,
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
    const { search, chartType, category, year, state, district } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'approved', domain: 'Energy' };
      if (chartType) query.chartType = chartType;
      if (category) query.category = category;
      if (year) query.year = year;
      if (state) query.state = state;
      if (district) query.district = district;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const datasets = await Dataset.find(query)
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Energy',
        count: datasets.length,
        datasets,
      });
    }

    const approvedList = memoryStore.datasets.filter(d => d.status === 'approved' && d.domain === 'Energy');
    const filteredList = filterDatasets(approvedList, { search, chartType, category, year, state, district });

    res.status(200).json({
      success: true,
      domain: 'Energy',
      count: filteredList.length,
      datasets: filteredList,
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
    const { search, chartType, category, year, state, district } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'approved', domain: 'Power' };
      if (chartType) query.chartType = chartType;
      if (category) query.category = category;
      if (year) query.year = year;
      if (state) query.state = state;
      if (district) query.district = district;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const datasets = await Dataset.find(query)
        .populate('uploadedBy', 'name')
        .sort('order publishedAt');

      return res.status(200).json({
        success: true,
        domain: 'Power',
        count: datasets.length,
        datasets,
      });
    }

    const approvedList = memoryStore.datasets.filter(d => d.status === 'approved' && d.domain === 'Power');
    const filteredList = filterDatasets(approvedList, { search, chartType, category, year, state, district });

    res.status(200).json({
      success: true,
      domain: 'Power',
      count: filteredList.length,
      datasets: filteredList,
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
