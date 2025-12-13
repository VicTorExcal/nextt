const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage de Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "api_uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    }
});
const upload = multer({ storage: storage});

module.exports = upload;
