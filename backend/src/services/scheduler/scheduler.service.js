const cron = require('node-cron');
const prisma = require('../../config/database');
const { getSocketService } = require('../socket/socket.service');
const logger = require('../../utils/logger');

let cronJob = null;

/**
 * Core bell-trigger logic — runs the schedule check for the current minute.
 * Called by the cron job (local/traditional servers) AND by the Vercel Cron
 * HTTP endpoint /api/v1/cron/trigger-bells.
 */
const triggerBells = async () => {
  const now = new Date();

  // Extract current time in Africa/Accra (UTC+0 / GMT)
  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const currentTime = `${timeParts.find((p) => p.type === 'hour').value}:${timeParts.find((p) => p.type === 'minute').value}`;

  const dayName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Accra', weekday: 'short',
  }).format(now).toUpperCase();
  const currentDay = dayName.slice(0, 3);

  const schedules = await prisma.schedule.findMany({
    where: {
      isActive: true,
      scheduledTime: currentTime,
      days: { has: currentDay },
    },
    include: {
      school: { select: { id: true, name: true, status: true } },
      audioFile: { select: { url: true } },
    },
  });

  if (schedules.length > 0) {
    logger.info(`Triggering ${schedules.length} schedule(s) at ${currentTime}`);
  }

  const socketService = getSocketService();

  for (const schedule of schedules) {
    if (schedule.school.status !== 'ACTIVE') continue;

    const resolvedAudioUrl = schedule.audioFile?.url || schedule.audioUrl || null;

    const announcement = await prisma.announcement.create({
      data: {
        schoolId: schedule.schoolId,
        scheduleId: schedule.id,
        title: schedule.title,
        announcementText: schedule.announcementText,
        audioUrl: resolvedAudioUrl,
        type: 'SCHEDULED',
        playedAt: now,
      },
    });

    if (socketService) {
      socketService.broadcastToSchool(schedule.schoolId, 'announcement:play', {
        announcementId: announcement.id,
        scheduleId: schedule.id,
        title: schedule.title,
        text: schedule.announcementText,
        audioUrl: resolvedAudioUrl,
        repeatCount: schedule.repeatCount,
        volume: schedule.volume,
        timestamp: now.toISOString(),
      });
    }

    logger.info(`Bell triggered: "${schedule.title}" for school ${schedule.schoolId}`);
  }

  return schedules.length;
};

const initCronJobs = () => {
  // Run every minute in Africa/Accra timezone
  cronJob = cron.schedule('* * * * *', async () => {
    try {
      await triggerBells();
    } catch (err) {
      logger.error('Cron job error:', err.message);
    }
  }, {
    timezone: 'Africa/Accra',
  });

  logger.info('Cron scheduler initialized');
};

const stopCronJobs = () => {
  if (cronJob) {
    cronJob.stop();
    logger.info('Cron jobs stopped');
  }
};

module.exports = { initCronJobs, stopCronJobs, triggerBells };
