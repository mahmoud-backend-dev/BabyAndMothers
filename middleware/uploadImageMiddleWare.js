const multer = require('multer');
const { BadRequest } = require('../errors');
const cloudinary = require('cloudinary').v2;

const fs = require('fs');

const multerOptions = (pathStoreImage) => {
    // 1) DisStorage engine
    const multerStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${pathStoreImage}`)
        },
        filename: function (req, file, cb) {
            // category-{id}-Date.now().jpeg
            const ext = file.mimetype.split('/')[1];
            const filename = `image-${Date.now()}.${ext}`;
            cb(null, filename);
        }
    });
    const fileFilter = async (req, file, cb) => {
        if (file.mimetype.startsWith("image"))
            cb(null, true)
        else
            cb(new BadRequest("Only Images allowed"), false);
    };
    const upload = multer({ storage: multerStorage, fileFilter });
    return upload;
}


exports.uploadSingleImage = (fieldName, pathStoreImage) => multerOptions(pathStoreImage).single(fieldName);

exports.uploadImageToCloudinary = async (path) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    });
    const data = await cloudinary.uploader.upload(path, { folder: "BabyAndMother" });
    secure_url = data.secure_url;
    fs.unlinkSync(path);
    return secure_url;
};
