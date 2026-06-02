const prisma = require('../../config/database');
const { getSocketService } = require('../../services/socket/socket.service');
const { logActivity } = require('../../utils/activityLogger');

const getAnnouncements = async (schoolId, { page = 1, limit = 20, type, from, to } = {}) => {
  const where = { schoolId };
  if (type) where.type = type;
  if (from || to) {
    where.playedAt = {};
    if (from) where.playedAt.gte = new Date(from);
    if (to) where.playedAt.lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where, skip, take: limit,
      include: { schedule: { select: { title: true } } },
      orderBy: { playedAt: 'desc' },
    }),
    prisma.announcement.count({ where }),
  ]);
  return { announcements, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const triggerEmergency = async (schoolId, { emergencyType, customText, userId }) => {
  const textMap = {
    FIRE_ALERT: 'EMERGENCY ALERT. Fire has been detected. All students and staff must evacuate the building immediately using the nearest exit.',
    SECURITY_ALERT: 'SECURITY ALERT. A security threat has been identified. All students and staff should move to designated safe areas immediately.',
    MEDICAL_EMERGENCY: 'MEDICAL EMERGENCY. Medical assistance is needed immediately. Please remain calm and follow instructions from staff.',
    LOCKDOWN: 'LOCKDOWN IN EFFECT. All students and staff must immediately go to the nearest classroom, lock the door and stay away from windows.',
  };

  const announcementText = emergencyType === 'CUSTOM' ? customText : textMap[emergencyType];
  if (!announcementText) {
    const err = new Error('Invalid emergency type or missing custom text');
    err.statusCode = 400;
    throw err;
  }

  const announcement = await prisma.announcement.create({
    data: {
      schoolId,
      title: `Emergency: ${emergencyType}`,
      announcementText,
      type: 'EMERGENCY',
      emergencyType,
      playedBy: userId,
    },
  });

  // Broadcast to all school devices via socket
  const socketService = getSocketService();
  if (socketService) {
    const devices = await prisma.device.count({ where: { schoolId, status: 'ONLINE' } });
    socketService.broadcastToSchool(schoolId, 'emergency:broadcast', {
      announcementId: announcement.id,
      text: announcementText,
      emergencyType,
      timestamp: new Date().toISOString(),
    });
    await prisma.announcement.update({ where: { id: announcement.id }, data: { deviceCount: devices } });
  }

  await logActivity(schoolId, userId, 'EMERGENCY_BROADCAST', 'announcement', announcement.id, { emergencyType });

  return announcement;
};

const triggerManual = async (schoolId, { title, announcementText, audioUrl, userId }) => {
  const announcement = await prisma.announcement.create({
    data: { schoolId, title, announcementText, audioUrl, type: 'MANUAL', playedBy: userId },
  });

  const socketService = getSocketService();
  if (socketService) {
    socketService.broadcastToSchool(schoolId, 'announcement:play', {
      announcementId: announcement.id,
      text: announcementText,
      audioUrl,
      type: 'MANUAL',
      timestamp: new Date().toISOString(),
    });
  }

  return announcement;
};

module.exports = { getAnnouncements, triggerEmergency, triggerManual };
