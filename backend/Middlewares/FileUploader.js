const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        public_id: (req, file) => file.originalname.split('.')[0],
        format: async (req, file) => {
            const ext = file.mimetype.split('/')[1];
            return ext;
        },
    },
});

const cloudinaryFileUploader = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PNG, JPG, and JPEG formats are allowed'));
        }
        cb(null, true);
    }
});

module.exports = {
    cloudinaryFileUploader
};