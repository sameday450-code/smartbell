const prisma = require('../../config/database');

const PLAN_CONFIG = {
  STARTER: { maxDevices: 5, features: [], price: 0 },
  PROFESSIONAL: { maxDevices: 25, features: ['CUSTOM_AUDIO', 'TTS', 'ANALYTICS'], price: 49 },
  ENTERPRISE: { maxDevices: 9999, features: ['CUSTOM_AUDIO', 'TTS', 'ANALYTICS', 'EMERGENCY', 'ADVANCED_ANALYTICS', 'API_ACCESS'], price: 149 },
};

const getSubscription = async (schoolId) => {
  const sub = await prisma.subscription.findUnique({ where: { schoolId } });
  if (!sub) {
    const err = new Error('Subscription not found');
    err.statusCode = 404;
    throw err;
  }
  return { ...sub, planConfig: PLAN_CONFIG[sub.plan] };
};

const upgradePlan = async (schoolId, plan) => {
  if (!PLAN_CONFIG[plan]) {
    const err = new Error('Invalid plan');
    err.statusCode = 400;
    throw err;
  }
  const config = PLAN_CONFIG[plan];
  return prisma.subscription.upsert({
    where: { schoolId },
    update: { plan, status: 'ACTIVE', maxDevices: config.maxDevices, features: config.features },
    create: { schoolId, plan, status: 'ACTIVE', maxDevices: config.maxDevices, features: config.features },
  });
};

const cancelSubscription = async (schoolId) => {
  return prisma.subscription.update({
    where: { schoolId },
    data: { status: 'CANCELLED' },
  });
};

const getAllSubscriptions = async ({ page = 1, limit = 20, status, plan } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (plan) where.plan = plan;

  const skip = (page - 1) * limit;
  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where, skip, take: limit,
      include: { school: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subscription.count({ where }),
  ]);
  return { subscriptions, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

module.exports = { getSubscription, upgradePlan, cancelSubscription, getAllSubscriptions, PLAN_CONFIG };
