const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadAudio = async (filePath, folder = 'smartbell/audio') => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'video', // Cloudinary uses 'video' for audio
    folder,
    allowed_formats: ['mp3', 'wav', 'ogg'],
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const uploadImage = async (filePath, folder = 'smartbell/images') => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const deleteFile = async (publicId, resourceType = 'video') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { cloudinary, uploadAudio, uploadImage, deleteFile };
