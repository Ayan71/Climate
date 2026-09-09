const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a chart title'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    domain: {
      type: String,
      required: [true, 'Please specify a domain'],
      enum: ['Climate', 'Energy', 'Power'],
    },
    chartType: {
      type: String,
      required: [true, 'Please select a chart type'],
      enum: ['latlng', 'statewise', 'timeseries_line', 'timeseries_bar', 'timeseries_area'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    csvFile: {
      type: String,
      default: '',
    },
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    columns: [
      {
        type: String,
      },
    ],
    publishedAt: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search & dynamic ordering
DatasetSchema.index({ status: 1, domain: 1, publishedAt: 1, order: 1 });

module.exports = mongoose.model('Dataset', DatasetSchema);
