// middlewares/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `instructor_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
