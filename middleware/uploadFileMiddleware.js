import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1000000 // --> set size 10 mb
    },
    fileFilter: function(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            return cb(new Error("Only images (PNG, JPG, JPEG) and PDFs are allowed"));
        }
        cb(null, true);
    },
});

export { uploadFile };