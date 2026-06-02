const prisma = require('../../config/database');
const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../../utils/crypto');

const register = async ({ name, email, password, schoolName, schoolEmail }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const existingSchool = await prisma.school.findUnique({ where: { email: schoolEmail } });
  if (existingSchool) {
    const err = new Error('A school with that email is already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const school = await tx.school.create({
      data: { name: schoolName, email: schoolEmail, status: 'ACTIVE' },
    });

    await tx.subscription.create({
      data: { schoolId: school.id, plan: 'STARTER', status: 'TRIAL', maxDevices: 5 },
    });

    const user = await tx.user.create({
      data: { name, email, password: hashed, role: 'SCHOOL_ADMIN', schoolId: school.id },
      select: { id: true, name: true, email: true, role: true, schoolId: true, createdAt: true },
    });

    return { user, school };
  });

  return result;
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { school: { select: { id: true, name: true, status: true } } },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is deactivated');
    err.statusCode = 403;
    throw err;
  }

  const payload = { sub: user.id, role: user.role, schoolId: user.schoolId };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLogin: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
      avatarUrl: user.avatarUrl,
    },
  };
};

const refreshTokens = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user || user.refreshToken !== token) {
    const err = new Error('Refresh token revoked');
    err.statusCode = 401;
    throw err;
  }

  const payload = { sub: user.id, role: user.role, schoolId: user.schoolId };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!(await comparePassword(currentPassword, user.password))) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed, refreshToken: null } });
};

const getProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, role: true, avatarUrl: true,
      schoolId: true, lastLogin: true, createdAt: true,
      school: { select: { id: true, name: true, logo: true, status: true } },
    },
  });
};

module.exports = { register, login, refreshTokens, logout, changePassword, getProfile };
