const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, schoolName, schoolEmail } = req.body;
    const result = await authService.register({ name, email, password, schoolName, schoolEmail });
    ApiResponse.created(res, result, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    ApiResponse.success(res, tokens, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    ApiResponse.success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    ApiResponse.success(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    ApiResponse.success(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, changePassword, getProfile };
