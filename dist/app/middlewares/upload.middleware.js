"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const MAX_FILE_SIZE_MB = 5;
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only JPG/PNG/WebP/AVIF images are allowed.'));
        }
        cb(null, true);
    },
});
