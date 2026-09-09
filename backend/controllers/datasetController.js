const fs = require('fs');
const csvParser = require('csv-parser');
const Dataset = require('../models/Dataset');
const ActivityLog = require('../models/ActivityLog');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');
const { validateCSV } = require('../utils/csvValidator');

const parseCSVContent = (csvString) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const Readable = require('stream').Readable;
    const stream = Readable.from([csvString]);

    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// @desc    Add new dataset with CSV upload & schema validation
// @route   POST /api/datasets
// @access  Private (Admin / SuperAdmin)
exports.createDataset = async (req, res) => {
  try {
    const { title, description, domain, chartType, rawCsvText } = req.body;

    if (!title || !domain || !chartType) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Title, Domain, and Chart Type',
      });
    }

    let csvContent = '';
    let csvFileName = '';

    if (req.file) {
      csvFileName = req.file.filename;
      csvContent = fs.readFileSync(req.file.path, 'utf8');
    } else if (rawCsvText) {
      csvContent = rawCsvText;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please upload a CSV file or provide CSV data',
      });
    }

    const rawRows = await parseCSVContent(csvContent);
    const validationResult = validateCSV(rawRows, chartType);

    if (!validationResult.isValid) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(422).json({
        success: false,
        error: 'CSV Schema Validation Failed',
        validationErrors: validationResult.errors,
      });
    }

    const newDataset = {
      _id: 'dataset_' + Date.now(),
      id: 'dataset_' + Date.now(),
      title,
      description: description || '',
      domain,
      chartType,
      status: 'pending',
      approvalStatus: 'pending',
      rejectionReason: '',
      uploadedBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      csvFile: csvFileName,
      parsedData: validationResult.parsedData,
      columns: validationResult.columns,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.datasets.unshift(newDataset);

    if (mongoose.connection.readyState === 1) {
      await Dataset.create({
        ...newDataset,
        uploadedBy: req.user.id,
      });
    }

    memoryStore.activityLogs.unshift({
      _id: 'log_' + Date.now(),
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'UPLOAD_DATASET',
      details: `Uploaded dataset '${newDataset.title}' (${newDataset.domain} - ${newDataset.chartType}) - Pending Approval`,
      ip: req.ip,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      dataset: newDataset,
      message: 'Dataset submitted successfully and is currently pending Super Admin review.',
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all datasets
// @route   GET /api/datasets
// @access  Private (Admin / SuperAdmin)
exports.getDatasets = async (req, res) => {
  try {
    const { status, domain, myOnly } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (req.user.role === 'admin' || myOnly === 'true') {
        query.uploadedBy = req.user.id;
      }
      if (status) query.status = status;
      if (domain) query.domain = domain;

      const datasets = await Dataset.find(query)
        .populate('uploadedBy', 'name email role')
        .sort('-createdAt');

      return res.status(200).json({
        success: true,
        count: datasets.length,
        datasets,
      });
    }

    let list = [...memoryStore.datasets];

    if (req.user.role === 'admin' || myOnly === 'true') {
      list = list.filter(d => {
        const uId = typeof d.uploadedBy === 'object' ? d.uploadedBy._id || d.uploadedBy.id : d.uploadedBy;
        return uId === req.user.id;
      });
    }

    if (status) {
      list = list.filter(d => d.status === status);
    }
    if (domain) {
      list = list.filter(d => d.domain === domain);
    }

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

// @desc    Get dataset by ID
// @route   GET /api/datasets/:id
// @access  Private
exports.getDatasetById = async (req, res) => {
  try {
    const dataset = memoryStore.datasets.find(d => d._id === req.params.id || d.id === req.params.id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found',
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

// @desc    Update pending dataset
// @route   PUT /api/datasets/:id
// @access  Private
exports.updateDataset = async (req, res) => {
  try {
    const dataset = memoryStore.datasets.find(d => d._id === req.params.id || d.id === req.params.id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found',
      });
    }

    const { title, description, domain, chartType } = req.body;
    if (title) dataset.title = title;
    if (description !== undefined) dataset.description = description;
    if (domain) dataset.domain = domain;
    if (chartType) dataset.chartType = chartType;

    if (req.user.role === 'admin') {
      dataset.status = 'pending';
      dataset.approvalStatus = 'pending';
    }

    if (mongoose.connection.readyState === 1) {
      let dbDataset = await Dataset.findById(req.params.id);
      if (dbDataset) {
        if (title) dbDataset.title = title;
        if (description !== undefined) dbDataset.description = description;
        if (domain) dbDataset.domain = domain;
        if (chartType) dbDataset.chartType = chartType;
        if (req.user.role === 'admin') {
          dbDataset.status = 'pending';
          dbDataset.approvalStatus = 'pending';
        }
        await dbDataset.save();
      }
    }

    res.status(200).json({
      success: true,
      dataset,
      message: 'Dataset updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete dataset
// @route   DELETE /api/datasets/:id
// @access  Private
exports.deleteDataset = async (req, res) => {
  try {
    const index = memoryStore.datasets.findIndex(d => d._id === req.params.id || d.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found',
      });
    }

    const dataset = memoryStore.datasets[index];
    memoryStore.datasets.splice(index, 1);

    if (mongoose.connection.readyState === 1) {
      await Dataset.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Dataset deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Approve Dataset (Super Admin)
// @route   PATCH /api/datasets/:id/approve
// @access  Private/SuperAdmin
exports.approveDataset = async (req, res) => {
  try {
    const dataset = memoryStore.datasets.find(d => d._id === req.params.id || d.id === req.params.id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found',
      });
    }

    const maxOrder = memoryStore.datasets.reduce((max, d) => Math.max(max, d.order || 0), 0);
    const newOrder = maxOrder + 1;

    dataset.status = 'approved';
    dataset.approvalStatus = 'approved';
    dataset.publishedAt = new Date();
    dataset.order = newOrder;
    dataset.rejectionReason = '';

    if (mongoose.connection.readyState === 1) {
      let dbDataset = await Dataset.findById(req.params.id);
      if (dbDataset) {
        dbDataset.status = 'approved';
        dbDataset.approvalStatus = 'approved';
        dbDataset.publishedAt = new Date();
        dbDataset.order = newOrder;
        dbDataset.rejectionReason = '';
        await dbDataset.save();
      }
    }

    memoryStore.activityLogs.unshift({
      _id: 'log_' + Date.now(),
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'APPROVE_DATASET',
      details: `Approved dataset '${dataset.title}'`,
      ip: req.ip,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      dataset,
      message: 'Dataset approved and published successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Reject Dataset (Super Admin)
// @route   PATCH /api/datasets/:id/reject
// @access  Private/SuperAdmin
exports.rejectDataset = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const dataset = memoryStore.datasets.find(d => d._id === req.params.id || d.id === req.params.id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: 'Dataset not found',
      });
    }

    dataset.status = 'rejected';
    dataset.approvalStatus = 'rejected';
    dataset.rejectionReason = rejectionReason || 'Dataset rejected during Super Admin review.';
    dataset.publishedAt = undefined;

    if (mongoose.connection.readyState === 1) {
      let dbDataset = await Dataset.findById(req.params.id);
      if (dbDataset) {
        dbDataset.status = 'rejected';
        dbDataset.approvalStatus = 'rejected';
        dbDataset.rejectionReason = dataset.rejectionReason;
        dbDataset.publishedAt = undefined;
        await dbDataset.save();
      }
    }

    memoryStore.activityLogs.unshift({
      _id: 'log_' + Date.now(),
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'REJECT_DATASET',
      details: `Rejected dataset '${dataset.title}'`,
      ip: req.ip,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      dataset,
      message: 'Dataset rejected.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
