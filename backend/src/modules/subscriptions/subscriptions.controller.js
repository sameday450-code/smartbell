const service = require('./subscriptions.service');
const ApiResponse = require('../../utils/apiResponse');

const getSubscription = async (req, res, next) => {
  try {
    const schoolId = req.user.role === 'SUPER_ADMIN' ? req.params.schoolId : req.user.schoolId;
    const sub = await service.getSubscription(schoolId);
    ApiResponse.success(res, sub);
  } catch (err) { next(err); }
};

const upgradePlan = async (req, res, next) => {
  try {
    const schoolId = req.user.role === 'SUPER_ADMIN' ? req.body.schoolId : req.user.schoolId;
    const sub = await service.upgradePlan(schoolId, req.body.plan);
    ApiResponse.success(res, sub, 'Plan updated successfully');
  } catch (err) { next(err); }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId;
    const sub = await service.cancelSubscription(schoolId);
    ApiResponse.success(res, sub, 'Subscription cancelled');
  } catch (err) { next(err); }
};

const getAllSubscriptions = async (req, res, next) => {
  try {
    const { page, limit, status, plan } = req.query;
    const result = await service.getAllSubscriptions({
      page: parseInt(page) || 1, limit: parseInt(limit) || 20, status, plan,
    });
    ApiResponse.paginated(res, result.subscriptions, result.pagination);
  } catch (err) { next(err); }
};

const getPlans = async (req, res, next) => {
  ApiResponse.success(res, service.PLAN_CONFIG, 'Available plans');
};

module.exports = { getSubscription, upgradePlan, cancelSubscription, getAllSubscriptions, getPlans };
