const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ALLOWED_AUDIO = ['.mp3', '.wav', '.ogg'];
const ALLOWED_IMAGE = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const audioFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_AUDIO.includes(ext)) return cb(null, true);
  cb(new Error(`Invalid audio format. Allowed: ${ALLOWED_AUDIO.join(', ')}`));
};

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_IMAGE.includes(ext)) return cb(null, true);
  cb(new Error(`Invalid image format. Allowed: ${ALLOWED_IMAGE.join(', ')}`));
};

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: MAX_AUDIO_SIZE },
});

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

module.exports = { uploadAudio, uploadImage };
