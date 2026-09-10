const memoryStore = require('../config/store');

// @desc    Get dashboard metrics & chart stats
// @route   GET /api/analytics/dashboard
// @access  Private (Admin / SuperAdmin)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === 'superadmin';
    let datasets = memoryStore.datasets;

    if (!isSuperAdmin) {
      datasets = datasets.filter(d => {
        const uId = typeof d.uploadedBy === 'object' ? d.uploadedBy._id || d.uploadedBy.id : d.uploadedBy;
        return uId === req.user.id;
      });
    }

    const totalDatasets = datasets.length;
    const pendingDatasets = datasets.filter(d => d.status === 'pending').length;
    const approvedDatasets = datasets.filter(d => d.status === 'approved').length;
    const rejectedDatasets = datasets.filter(d => d.status === 'rejected').length;

    const admins = memoryStore.users.filter(u => u.role === 'admin');
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(u => u.isActive).length;

    const climateCount = datasets.filter(d => d.domain === 'Climate').length;
    const energyCount = datasets.filter(d => d.domain === 'Energy').length;
    const powerCount = datasets.filter(d => d.domain === 'Power').length;

    const latlngCount = datasets.filter(d => d.chartType === 'latlng').length;
    const statewiseCount = datasets.filter(d => d.chartType === 'statewise').length;
    const timeseriesCount = datasets.filter(d =>
      ['timeseries_line', 'timeseries_bar', 'timeseries_area'].includes(d.chartType)
    ).length;

    res.status(200).json({
      success: true,
      cards: {
        totalUsers: memoryStore.users.length,
        totalDatasets,
        pendingDatasets,
        approvedDatasets,
        rejectedDatasets,
        totalAdmins,
        activeAdmins,
      },
      domainBreakdown: [
        { domain: 'Climate', count: climateCount },
        { domain: 'Energy', count: energyCount },
        { domain: 'Power', count: powerCount },
      ],
      chartTypeBreakdown: [
        { type: 'Latitude / Longitude Map', count: latlngCount },
        { type: 'State-wise Heatmap', count: statewiseCount },
        { type: 'Time-Series Chart', count: timeseriesCount },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get activity logs
// @route   GET /api/analytics/activity-logs
// @access  Private/SuperAdmin
exports.getActivityLogs = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: memoryStore.activityLogs.length,
      logs: memoryStore.activityLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
