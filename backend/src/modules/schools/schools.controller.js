const schoolService = require('./schools.service');
const ApiResponse = require('../../utils/apiResponse');

const createSchool = async (req, res, next) => {
  try {
    const school = await schoolService.createSchool(req.body, req.file);
    ApiResponse.created(res, school, 'School created successfully');
  } catch (err) { next(err); }
};

const getAllSchools = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await schoolService.getAllSchools({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status, search,
    });
    ApiResponse.paginated(res, result.schools, result.pagination);
  } catch (err) { next(err); }
};

const getSchool = async (req, res, next) => {
  try {
    const school = await schoolService.getSchoolById(req.params.id);
    ApiResponse.success(res, school);
  } catch (err) { next(err); }
};

const updateSchool = async (req, res, next) => {
  try {
    const school = await schoolService.updateSchool(req.params.id, req.body, req.file);
    ApiResponse.success(res, school, 'School updated');
  } catch (err) { next(err); }
};

const updateSchoolStatus = async (req, res, next) => {
  try {
    const school = await schoolService.updateSchoolStatus(req.params.id, req.body.status);
    ApiResponse.success(res, school, 'School status updated');
  } catch (err) { next(err); }
};

const deleteSchool = async (req, res, next) => {
  try {
    await schoolService.deleteSchool(req.params.id);
    ApiResponse.success(res, null, 'School deleted');
  } catch (err) { next(err); }
};

module.exports = { createSchool, getAllSchools, getSchool, updateSchool, updateSchoolStatus, deleteSchool };
