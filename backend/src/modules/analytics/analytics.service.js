const prisma = require('../../config/database');

const getDashboardStats = async (schoolId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    todayAnnouncements,
    onlineDevices,
    totalDevices,
    activeSchedules,
    monthlyAnnouncements,
    recentActivity,
  ] = await Promise.all([
    prisma.announcement.count({ where: { schoolId, playedAt: { gte: today, lt: tomorrow } } }),
    prisma.device.count({ where: { schoolId, status: 'ONLINE', isActive: true } }),
    prisma.device.count({ where: { schoolId, isActive: true } }),
    prisma.schedule.count({ where: { schoolId, isActive: true } }),
    prisma.announcement.count({
      where: {
        schoolId,
        playedAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
      },
    }),
    prisma.activityLog.findMany({
      where: { schoolId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    todayAnnouncements,
    onlineDevices,
    totalDevices,
    activeSchedules,
    monthlyAnnouncements,
    recentActivity,
  };
};

const getSuperAdminStats = async () => {
  const [totalSchools, activeSchools, suspendedSchools, totalUsers, totalAnnouncements] = await Promise.all([
    prisma.school.count(),
    prisma.school.count({ where: { status: 'ACTIVE' } }),
    prisma.school.count({ where: { status: 'SUSPENDED' } }),
    prisma.user.count(),
    prisma.announcement.count(),
  ]);

  return { totalSchools, activeSchools, suspendedSchools, totalUsers, totalAnnouncements };
};

const getUsageChart = async (schoolId, period = 'daily') => {
  const now = new Date();
  let from, groupBy;

  if (period === 'daily') {
    from = new Date(now);
    from.setDate(from.getDate() - 7);
    groupBy = 'day';
  } else if (period === 'weekly') {
    from = new Date(now);
    from.setDate(from.getDate() - 28);
    groupBy = 'week';
  } else {
    from = new Date(now);
    from.setMonth(from.getMonth() - 12);
    groupBy = 'month';
  }

  const announcements = await prisma.announcement.findMany({
    where: { schoolId, playedAt: { gte: from } },
    select: { playedAt: true },
    orderBy: { playedAt: 'asc' },
  });

  // Group by period
  const grouped = {};
  announcements.forEach(({ playedAt }) => {
    const d = new Date(playedAt);
    let key;
    if (groupBy === 'day') key = d.toISOString().split('T')[0];
    else if (groupBy === 'week') {
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      key = startOfWeek.toISOString().split('T')[0];
    } else key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

module.exports = { getDashboardStats, getSuperAdminStats, getUsageChart };
