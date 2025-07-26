const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let resource_type = 'image';
        const imageFormats = ['image/jpeg', 'image/png', 'image/webp'];
        const videoFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

        if (videoFormats.includes(file.mimetype)) {
            resource_type = 'video';
        }

        return {
            folder: resource_type === 'image' ? 'blogs/images' : 'blogs/videos',
            resource_type,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi'],
            transformation: resource_type === 'image' ? [{ width: 1000, crop: 'limit' }] : undefined
        };
    }
});

const upload = multer({ storage });

module.exports = {
  upload,
  cloudinary,
};
