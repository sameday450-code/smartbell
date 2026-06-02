const prisma = require('../config/database');
const logger = require('./logger');

const logActivity = async (schoolId, userId, action, resource, resourceId, details = null) => {
  try {
    await prisma.activityLog.create({
      data: {
        schoolId,
        userId,
        action,
        resource,
        resourceId,
        details,
      },
    });
  } catch (err) {
    logger.error('Failed to log activity:', err.message);
  }
};

module.exports = { logActivity };
