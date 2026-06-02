const deviceService = require('./devices.service');
const ApiResponse = require('../../utils/apiResponse');

const getDevices = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.paginated(res, [], { total: 0, page: 1, limit: 20, pages: 0 });
    const { page, limit, status, search } = req.query;
    const result = await deviceService.getDevices(req.user.schoolId, {
      page: parseInt(page) || 1, limit: parseInt(limit) || 20, status, search,
    });
    ApiResponse.paginated(res, result.devices, result.pagination);
  } catch (err) { next(err); }
};

const getDevice = async (req, res, next) => {
  try {
    const device = await deviceService.getDeviceById(req.params.id, req.user.schoolId);
    ApiResponse.success(res, device);
  } catch (err) { next(err); }
};

const registerDevice = async (req, res, next) => {
  try {
    const device = await deviceService.registerDevice({ ...req.body, schoolId: req.user.schoolId });
    ApiResponse.created(res, device, 'Device registered');
  } catch (err) { next(err); }
};

const updateDevice = async (req, res, next) => {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.user.schoolId, req.body);
    ApiResponse.success(res, device, 'Device updated');
  } catch (err) { next(err); }
};

const deleteDevice = async (req, res, next) => {
  try {
    await deviceService.deleteDevice(req.params.id, req.user.schoolId);
    ApiResponse.success(res, null, 'Device removed');
  } catch (err) { next(err); }
};

module.exports = { getDevices, getDevice, registerDevice, updateDevice, deleteDevice };
