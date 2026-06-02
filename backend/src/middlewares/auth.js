const { verifyAccessToken } = require('../utils/crypto');
const ApiResponse = require('../utils/apiResponse');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { school: { select: { id: true, name: true, status: true } } },
    });

    if (!user || !user.isActive) {
      return ApiResponse.unauthorized(res, 'User not found or deactivated');
    }

    if (user.school && user.school.status === 'SUSPENDED') {
      return ApiResponse.forbidden(res, 'School account is suspended');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
