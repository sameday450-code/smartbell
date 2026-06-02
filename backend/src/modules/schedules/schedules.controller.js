const service = require('./schedules.service');
const ApiResponse = require('../../utils/apiResponse');

const getSchedules = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.paginated(res, [], { total: 0, page: 1, limit: 50, pages: 0 });
    const { page, limit, active } = req.query;
    const result = await service.getSchedules(req.user.schoolId, {
      page: parseInt(page) || 1, limit: parseInt(limit) || 50, active,
    });
    ApiResponse.paginated(res, result.schedules, result.pagination);
  } catch (err) { next(err); }
};

const getSchedule = async (req, res, next) => {
  try {
    const schedule = await service.getScheduleById(req.params.id, req.user.schoolId);
    ApiResponse.success(res, schedule);
  } catch (err) { next(err); }
};

const createSchedule = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.badRequest(res, 'No school associated with your account');
    const schedule = await service.createSchedule(req.user.schoolId, req.body, req.file);
    ApiResponse.created(res, schedule, 'Schedule created');
  } catch (err) { next(err); }
};

const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await service.updateSchedule(req.params.id, req.user.schoolId, req.body, req.file);
    ApiResponse.success(res, schedule, 'Schedule updated');
  } catch (err) { next(err); }
};

const deleteSchedule = async (req, res, next) => {
  try {
    await service.deleteSchedule(req.params.id, req.user.schoolId);
    ApiResponse.success(res, null, 'Schedule deleted');
  } catch (err) { next(err); }
};

const toggleSchedule = async (req, res, next) => {
  try {
    const schedule = await service.toggleSchedule(req.params.id, req.user.schoolId);
    ApiResponse.success(res, schedule, `Schedule ${schedule.isActive ? 'enabled' : 'disabled'}`);
  } catch (err) { next(err); }
};

module.exports = { getSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule, toggleSchedule };
