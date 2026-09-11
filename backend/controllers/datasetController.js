const fs = require('fs');
const csvParser = require('csv-parser');
const Dataset = require('../models/Dataset');
const Approval = require('../models/Approval');
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
    const {
      title,
      description,
      domain,
      chartType,
      category,
      tags,
      source,
      year,
      state,
      district,
      downloadEnabled,
      rawCsvText,
    } = req.body;

    if (!title || !domain) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Title and Domain',
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
    const selectedType = chartType || 'auto';
    const validationResult = validateCSV(rawRows, selectedType);

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

    const finalChartType = validationResult.detectedChartType || chartType || 'timeseries_line';

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const datasetObjectId = new mongoose.Types.ObjectId();
    const datasetIdStr = datasetObjectId.toString();

    const newDataset = {
      _id: datasetIdStr,
      id: datasetIdStr,
      title,
      description: description || '',
      domain,
      chartType: finalChartType,
      category: category || 'General',
      tags: parsedTags,
      source: source || 'Government / Open Data Repository',
      year: year || '',
      state: state || '',
      district: district || '',
      downloadEnabled: downloadEnabled !== undefined ? Boolean(downloadEnabled) : true,
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
        _id: datasetObjectId,
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
    const { status, domain, category, year, state, myOnly, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (req.user.role === 'admin' || myOnly === 'true') {
        query.uploadedBy = req.user.id;
      }
      if (status) query.status = status;
      if (domain) query.domain = domain;
      if (category) query.category = category;
      if (year) query.year = year;
      if (state) query.state = state;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { source: { $regex: search, $options: 'i' } },
        ];
      }

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

    if (status) list = list.filter(d => d.status === status);
    if (domain) list = list.filter(d => d.domain === domain);
    if (category) list = list.filter(d => d.category === category);
    if (year) list = list.filter(d => String(d.year) === String(year));
    if (state) list = list.filter(d => d.state === state);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(d =>
        (d.title && d.title.toLowerCase().includes(s)) ||
        (d.description && d.description.toLowerCase().includes(s)) ||
        (d.source && d.source.toLowerCase().includes(s)) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(s)))
      );
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

    const {
      title,
      description,
      domain,
      chartType,
      category,
      tags,
      source,
      year,
      state,
      district,
      downloadEnabled,
    } = req.body;

    if (title) dataset.title = title;
    if (description !== undefined) dataset.description = description;
    if (domain) dataset.domain = domain;
    if (chartType) dataset.chartType = chartType;
    if (category) dataset.category = category;
    if (tags) dataset.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim());
    if (source) dataset.source = source;
    if (year !== undefined) dataset.year = year;
    if (state !== undefined) dataset.state = state;
    if (district !== undefined) dataset.district = district;
    if (downloadEnabled !== undefined) dataset.downloadEnabled = Boolean(downloadEnabled);

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
        if (category) dbDataset.category = category;
        if (tags) dbDataset.tags = dataset.tags;
        if (source) dbDataset.source = source;
        if (year !== undefined) dbDataset.year = year;
        if (state !== undefined) dbDataset.state = state;
        if (district !== undefined) dbDataset.district = district;
        if (downloadEnabled !== undefined) dbDataset.downloadEnabled = Boolean(downloadEnabled);
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

    const approvalEntry = {
      _id: 'app_' + Date.now(),
      dataset: dataset._id || dataset.id,
      datasetTitle: dataset.title,
      reviewedBy: req.user.id,
      reviewerName: req.user.name,
      action: 'approved',
      rejectionReason: '',
      createdAt: new Date(),
    };

    if (!memoryStore.approvals) memoryStore.approvals = [];
    memoryStore.approvals.unshift(approvalEntry);

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
      await Approval.create({
        dataset: req.params.id,
        datasetTitle: dataset.title,
        reviewedBy: req.user.id,
        reviewerName: req.user.name,
        action: 'approved',
      });
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

    const reason = rejectionReason || 'Dataset rejected during Super Admin review.';

    dataset.status = 'rejected';
    dataset.approvalStatus = 'rejected';
    dataset.rejectionReason = reason;
    dataset.publishedAt = undefined;

    const approvalEntry = {
      _id: 'app_' + Date.now(),
      dataset: dataset._id || dataset.id,
      datasetTitle: dataset.title,
      reviewedBy: req.user.id,
      reviewerName: req.user.name,
      action: 'rejected',
      rejectionReason: reason,
      createdAt: new Date(),
    };

    if (!memoryStore.approvals) memoryStore.approvals = [];
    memoryStore.approvals.unshift(approvalEntry);

    if (mongoose.connection.readyState === 1) {
      let dbDataset = await Dataset.findById(req.params.id);
      if (dbDataset) {
        dbDataset.status = 'rejected';
        dbDataset.approvalStatus = 'rejected';
        dbDataset.rejectionReason = reason;
        dbDataset.publishedAt = undefined;
        await dbDataset.save();
      }
      await Approval.create({
        dataset: req.params.id,
        datasetTitle: dataset.title,
        reviewedBy: req.user.id,
        reviewerName: req.user.name,
        action: 'rejected',
        rejectionReason: reason,
      });
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
