const service = require('./analytics.service');
const ApiResponse = require('../../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    let stats;
    if (req.user.role === 'SUPER_ADMIN') {
      stats = await service.getSuperAdminStats();
    } else if (!req.user.schoolId) {
      stats = { todayAnnouncements: 0, onlineDevices: 0, totalDevices: 0, activeSchedules: 0, monthlyAnnouncements: 0, recentActivity: [] };
    } else {
      stats = await service.getDashboardStats(req.user.schoolId);
    }
    ApiResponse.success(res, stats);
  } catch (err) { next(err); }
};

const getUsageChart = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.success(res, { labels: [], data: [] });
    const data = await service.getUsageChart(req.user.schoolId, req.query.period);
    ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getUsageChart };
