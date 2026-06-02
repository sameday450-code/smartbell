const ApiResponse = require('../utils/apiResponse');

const ROLE_HIERARCHY = {
  SUPER_ADMIN: 3,
  SCHOOL_ADMIN: 2,
  STAFF: 1,
};

/**
 * Require one or more roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return ApiResponse.unauthorized(res);

  const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
  const hasRole = roles.some((role) => {
    const requiredLevel = ROLE_HIERARCHY[role] || 0;
    return userLevel >= requiredLevel;
  });

  if (!hasRole) {
    return ApiResponse.forbidden(res, 'Insufficient permissions');
  }
  next();
};

/**
 * Ensure user belongs to the school in the route param
 */
const requireSchoolAccess = (req, res, next) => {
  if (!req.user) return ApiResponse.unauthorized(res);
  if (req.user.role === 'SUPER_ADMIN') return next();

  const schoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;
  if (schoolId && req.user.schoolId !== schoolId) {
    return ApiResponse.forbidden(res, 'Access denied to this school');
  }
  next();
};

module.exports = { requireRole, requireSchoolAccess };
