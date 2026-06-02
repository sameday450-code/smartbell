const prisma = require('../../config/database');
const { hashPassword } = require('../../utils/crypto');

const getUsers = async (schoolId, { page = 1, limit = 20, role, search } = {}) => {
  const where = { schoolId };
  if (role) where.role = role;
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { email: { contains: search, mode: 'insensitive' } },
  ];

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const getUserById = async (id, schoolId) => {
  const where = { id };
  const user = await prisma.user.findUnique({
    where,
    select: { id: true, name: true, email: true, role: true, isActive: true, avatarUrl: true, lastLogin: true, createdAt: true, schoolId: true },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (schoolId && user.schoolId !== schoolId) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }
  return user;
};

const createUser = async ({ name, email, password, role, schoolId }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already exists');
    err.statusCode = 409;
    throw err;
  }
  const hashed = await hashPassword(password);
  return prisma.user.create({
    data: { name, email, password: hashed, role, schoolId },
    select: { id: true, name: true, email: true, role: true, schoolId: true, createdAt: true },
  });
};

const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true, updatedAt: true },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
