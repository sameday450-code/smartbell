const prisma = require('../../config/database');
const { uploadImage, deleteFile } = require('../../config/cloudinary');
const fs = require('fs');

const PLAN_LIMITS = { STARTER: 5, PROFESSIONAL: 25, ENTERPRISE: 9999 };

const createSchool = async (data, logoFile) => {
  let logo = null, logoPublicId = null;
  if (logoFile) {
    const result = await uploadImage(logoFile.path);
    logo = result.url;
    logoPublicId = result.publicId;
    fs.unlinkSync(logoFile.path);
  }

  const school = await prisma.school.create({
    data: { ...data, logo, logoPublicId },
  });

  // Create default subscription
  await prisma.subscription.create({
    data: { schoolId: school.id, plan: 'STARTER', status: 'TRIAL', maxDevices: 5 },
  });

  return school;
};

const getAllSchools = async ({ page = 1, limit = 20, status, search } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const skip = (page - 1) * limit;
  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      skip,
      take: limit,
      include: { subscription: true, _count: { select: { users: true, devices: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.school.count({ where }),
  ]);

  return { schools, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const getSchoolById = async (id) => {
  const school = await prisma.school.findUnique({
    where: { id },
    include: {
      subscription: true,
      _count: { select: { users: true, devices: true, schedules: true, announcements: true } },
    },
  });
  if (!school) {
    const err = new Error('School not found');
    err.statusCode = 404;
    throw err;
  }
  return school;
};

const updateSchool = async (id, data, logoFile) => {
  const school = await prisma.school.findUnique({ where: { id } });
  if (!school) {
    const err = new Error('School not found');
    err.statusCode = 404;
    throw err;
  }

  let logo = school.logo, logoPublicId = school.logoPublicId;
  if (logoFile) {
    if (logoPublicId) await deleteFile(logoPublicId, 'image');
    const result = await uploadImage(logoFile.path);
    logo = result.url;
    logoPublicId = result.publicId;
    fs.unlinkSync(logoFile.path);
  }

  return prisma.school.update({ where: { id }, data: { ...data, logo, logoPublicId } });
};

const updateSchoolStatus = async (id, status) => {
  return prisma.school.update({ where: { id }, data: { status } });
};

const deleteSchool = async (id) => {
  return prisma.school.delete({ where: { id } });
};

module.exports = { createSchool, getAllSchools, getSchoolById, updateSchool, updateSchoolStatus, deleteSchool };
