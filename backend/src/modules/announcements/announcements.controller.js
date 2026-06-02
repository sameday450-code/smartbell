const service = require('./announcements.service');
const ApiResponse = require('../../utils/apiResponse');

const getAnnouncements = async (req, res, next) => {
  try {
    if (!req.user.schoolId) {
      return ApiResponse.paginated(res, [], { total: 0, page: 1, limit: 20, pages: 0 });
    }
    const { page, limit, type, from, to } = req.query;
    const result = await service.getAnnouncements(req.user.schoolId, {
      page: parseInt(page) || 1, limit: parseInt(limit) || 20, type, from, to,
    });
    ApiResponse.paginated(res, result.announcements, result.pagination);
  } catch (err) { next(err); }
};

const triggerEmergency = async (req, res, next) => {
  try {
    const announcement = await service.triggerEmergency(req.user.schoolId, {
      ...req.body, userId: req.user.id,
    });
    ApiResponse.created(res, announcement, 'Emergency broadcast sent');
  } catch (err) { next(err); }
};

const triggerManual = async (req, res, next) => {
  try {
    const announcement = await service.triggerManual(req.user.schoolId, {
      ...req.body, userId: req.user.id,
    });
    ApiResponse.created(res, announcement, 'Announcement triggered');
  } catch (err) { next(err); }
};

module.exports = { getAnnouncements, triggerEmergency, triggerManual };
