const userService = require('./users.service');
const ApiResponse = require('../../utils/apiResponse');

const getUsers = async (req, res, next) => {
  try {
    const schoolId = req.user.role === 'SUPER_ADMIN' ? req.query.schoolId : req.user.schoolId;
    const { page, limit, role, search } = req.query;
    const result = await userService.getUsers(schoolId, {
      page: parseInt(page) || 1, limit: parseInt(limit) || 20, role, search,
    });
    ApiResponse.paginated(res, result.users, result.pagination);
  } catch (err) { next(err); }
};

const getUser = async (req, res, next) => {
  try {
    const schoolId = req.user.role === 'SUPER_ADMIN' ? null : req.user.schoolId;
    const user = await userService.getUserById(req.params.id, schoolId);
    ApiResponse.success(res, user);
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const schoolId = req.user.role === 'SUPER_ADMIN' ? req.body.schoolId : req.user.schoolId;
    const user = await userService.createUser({ ...req.body, schoolId });
    ApiResponse.created(res, user, 'User created');
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    ApiResponse.success(res, user, 'User updated');
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    ApiResponse.success(res, null, 'User deleted');
  } catch (err) { next(err); }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
