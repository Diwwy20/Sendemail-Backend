import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/Profile"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadPicture = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1000000
    },
    fileFilter: function(req, file, cb){
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== 'jpeg'){
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});

export { uploadPicture }