const service = require('./audio-files.service');
const ApiResponse = require('../../utils/apiResponse');

const getAudioFiles = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.success(res, []);
    const files = await service.getAudioFiles(req.user.schoolId);
    ApiResponse.success(res, files);
  } catch (err) { next(err); }
};

const uploadAudioFile = async (req, res, next) => {
  try {
    if (!req.user.schoolId) return ApiResponse.badRequest(res, 'No school associated with your account');
    if (!req.file) return ApiResponse.badRequest(res, 'Audio file is required');
    const file = await service.uploadAudioFile(req.user.schoolId, req.body.name, req.file);
    ApiResponse.created(res, file, 'Audio file uploaded successfully');
  } catch (err) { next(err); }
};

const deleteAudioFile = async (req, res, next) => {
  try {
    await service.deleteAudioFile(req.params.id, req.user.schoolId);
    ApiResponse.success(res, null, 'Audio file deleted');
  } catch (err) { next(err); }
};

module.exports = { getAudioFiles, uploadAudioFile, deleteAudioFile };
