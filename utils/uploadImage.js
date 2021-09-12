const multer = require('multer');
const sharp = require('sharp');

const AppError = require('./appError');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'dist/img')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//     }
// });

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Not an Image, please try again', 400));
}

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter
});

exports.resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({
            quality: 90
        })
        .toFile(`dist/img/${req.file.filename}`);

    next();
}

exports.uploadPhoto = upload.single('photo');