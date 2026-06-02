const prisma = require('../../config/database');
const { getSocketService } = require('../../services/socket/socket.service');

const getDevices = async (schoolId, { page = 1, limit = 20, status, search } = {}) => {
  const where = { schoolId, isActive: true };
  if (status) where.status = status;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const skip = (page - 1) * limit;
  const [devices, total] = await Promise.all([
    prisma.device.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.device.count({ where }),
  ]);
  return { devices, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const getDeviceById = async (id, schoolId) => {
  const device = await prisma.device.findFirst({ where: { id, schoolId } });
  if (!device) {
    const err = new Error('Device not found');
    err.statusCode = 404;
    throw err;
  }
  return device;
};

const registerDevice = async ({ schoolId, name, location, deviceType }) => {
  // Check subscription limit
  const subscription = await prisma.subscription.findUnique({ where: { schoolId } });
  const deviceCount = await prisma.device.count({ where: { schoolId, isActive: true } });

  if (subscription && deviceCount >= subscription.maxDevices) {
    const err = new Error(`Device limit reached for your plan (${subscription.maxDevices})`);
    err.statusCode = 403;
    throw err;
  }

  return prisma.device.create({ data: { schoolId, name, location, deviceType } });
};

const updateDevice = async (id, schoolId, data) => {
  await getDeviceById(id, schoolId);
  return prisma.device.update({ where: { id }, data });
};

const deleteDevice = async (id, schoolId) => {
  await getDeviceById(id, schoolId);
  return prisma.device.update({ where: { id }, data: { isActive: false } });
};

const updateDeviceStatus = async (socketId, status, schoolId) => {
  const device = await prisma.device.findFirst({ where: { socketId } });
  if (!device) return null;

  return prisma.device.update({
    where: { id: device.id },
    data: { status, lastSeen: new Date() },
  });
};

module.exports = { getDevices, getDeviceById, registerDevice, updateDevice, deleteDevice, updateDeviceStatus };
