const prisma = require('../../config/database');
const { uploadAudio: cloudinaryUpload, deleteFile } = require('../../config/cloudinary');
const { getSocketService } = require('../../services/socket/socket.service');
const ttsService = require('../../services/tts/tts.service');
const fs = require('fs');

const getSchedules = async (schoolId, { page = 1, limit = 50, active } = {}) => {
  const where = { schoolId };
  if (active !== undefined) where.isActive = active === 'true';

  const [schedules, total] = await Promise.all([
    prisma.schedule.findMany({
      where, skip: (page - 1) * limit, take: limit,
      orderBy: [{ scheduledTime: 'asc' }],
      include: { audioFile: { select: { id: true, name: true, url: true } } },
    }),
    prisma.schedule.count({ where }),
  ]);
  return { schedules, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const getScheduleById = async (id, schoolId) => {
  const schedule = await prisma.schedule.findFirst({ where: { id, schoolId } });
  if (!schedule) {
    const err = new Error('Schedule not found');
    err.statusCode = 404;
    throw err;
  }
  return schedule;
};

const createSchedule = async (schoolId, data, audioFile) => {
  let audioUrl = null, audioPublicId = null;
  let audioFileId = data.audioFileId || null;

  if (audioFile) {
    const result = await cloudinaryUpload(audioFile.path);
    audioUrl = result.url;
    audioPublicId = result.publicId;
    fs.unlinkSync(audioFile.path);
    audioFileId = null; // direct upload overrides library link
  } else if (audioFileId) {
    // Resolve audio URL from the school's audio library
    const libFile = await prisma.audioFile.findFirst({ where: { id: audioFileId, schoolId } });
    if (libFile) audioUrl = libFile.url;
    else audioFileId = null;
  } else if (data.generateTts && data.announcementText) {
    const ttsResult = await ttsService.generateTTS(data.announcementText, data.voiceId);
    audioUrl = ttsResult.url;
    audioPublicId = ttsResult.publicId;
  }

  const schedule = await prisma.schedule.create({
    data: {
      schoolId,
      title: data.title,
      announcementText: data.announcementText,
      scheduledTime: data.scheduledTime,
      days: data.days || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      repeatCount: parseInt(data.repeatCount) || 2,
      volume: parseFloat(data.volume) || 1.0,
      voiceId: data.voiceId,
      audioUrl,
      audioPublicId,
      audioFileId,
      isActive: data.isActive !== false,
    },
  });

  // Update cron jobs
  const socketService = getSocketService();
  if (socketService) socketService.broadcastToSchool(schoolId, 'schedule:created', schedule);

  return schedule;
};

const updateSchedule = async (id, schoolId, data, audioFile) => {
  const existing = await getScheduleById(id, schoolId);

  let audioUrl = existing.audioUrl, audioPublicId = existing.audioPublicId;
  let audioFileId = data.audioFileId !== undefined ? (data.audioFileId || null) : existing.audioFileId;

  if (audioFile) {
    if (existing.audioPublicId) await deleteFile(existing.audioPublicId);
    const result = await cloudinaryUpload(audioFile.path);
    audioUrl = result.url;
    audioPublicId = result.publicId;
    fs.unlinkSync(audioFile.path);
    audioFileId = null;
  } else if (audioFileId && audioFileId !== existing.audioFileId) {
    // Changed library selection — resolve new URL
    const libFile = await prisma.audioFile.findFirst({ where: { id: audioFileId, schoolId } });
    if (libFile) {
      if (existing.audioPublicId) await deleteFile(existing.audioPublicId);
      audioUrl = libFile.url;
      audioPublicId = null;
    } else {
      audioFileId = existing.audioFileId;
    }
  } else if (!audioFileId && data.audioFileId === null) {
    // Explicitly cleared library selection
    audioUrl = null;
    audioPublicId = null;
  } else if (data.generateTts && data.announcementText) {
    if (existing.audioPublicId) await deleteFile(existing.audioPublicId);
    const ttsResult = await ttsService.generateTTS(data.announcementText, data.voiceId);
    audioUrl = ttsResult.url;
    audioPublicId = ttsResult.publicId;
  }

  const schedule = await prisma.schedule.update({
    where: { id },
    data: {
      title: data.title,
      announcementText: data.announcementText,
      scheduledTime: data.scheduledTime,
      days: data.days,
      repeatCount: parseInt(data.repeatCount),
      volume: parseFloat(data.volume),
      voiceId: data.voiceId,
      isActive: data.isActive,
      audioUrl,
      audioPublicId,
      audioFileId,
    },
  });

  const socketService = getSocketService();
  if (socketService) socketService.broadcastToSchool(schoolId, 'schedule:updated', schedule);

  return schedule;
};

const deleteSchedule = async (id, schoolId) => {
  const existing = await getScheduleById(id, schoolId);
  if (existing.audioPublicId) await deleteFile(existing.audioPublicId);
  return prisma.schedule.delete({ where: { id } });
};

const toggleSchedule = async (id, schoolId) => {
  const schedule = await getScheduleById(id, schoolId);
  return prisma.schedule.update({ where: { id }, data: { isActive: !schedule.isActive } });
};

module.exports = { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule, toggleSchedule };
