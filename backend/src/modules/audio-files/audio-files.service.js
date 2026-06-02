const prisma = require('../../config/database');
const { uploadAudio: cloudinaryUpload, deleteFile } = require('../../config/cloudinary');
const fs = require('fs');

const getAudioFiles = async (schoolId) => {
  return prisma.audioFile.findMany({
    where: { schoolId },
    orderBy: { createdAt: 'desc' },
  });
};

const uploadAudioFile = async (schoolId, name, file) => {
  const result = await cloudinaryUpload(file.path);
  if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

  return prisma.audioFile.create({
    data: {
      schoolId,
      name: name?.trim() || file.originalname,
      url: result.url,
      publicId: result.publicId,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });
};

const deleteAudioFile = async (id, schoolId) => {
  const file = await prisma.audioFile.findFirst({ where: { id, schoolId } });
  if (!file) {
    const err = new Error('Audio file not found');
    err.statusCode = 404;
    throw err;
  }
  await deleteFile(file.publicId);
  return prisma.audioFile.delete({ where: { id } });
};

module.exports = { getAudioFiles, uploadAudioFile, deleteAudioFile };
