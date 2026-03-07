// upload.middleware.ts
import multer from 'multer';

const MAX_FILE_SIZE_MB = 5;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG/PNG/WebP/AVIF images are allowed.'));
    }
    cb(null, true);
  },
});
