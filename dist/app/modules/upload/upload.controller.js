"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const upload_1 = require("../../utils/upload");
const uploadImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    console.log([file]);
    if (!file)
        throw new Error('No file uploaded');
    const publicId = (0, upload_1.slugifyFilename)(file.originalname);
    const uploaded = yield (0, upload_1.uploadImageBuffer)(file.buffer, {
        folder: 'hatsmaster/uploads',
        publicId,
    });
    const optimizedUrl = (0, upload_1.getOptimizedImageUrl)(uploaded.publicId, {
        width: 1200,
        height: 1200,
        crop: 'limit',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto',
        dpr: 'auto',
    });
    res.status(201).json({
        success: true,
        data: Object.assign(Object.assign({}, uploaded), { optimizedUrl }),
    });
}));
exports.uploadController = {
    uploadImage
};
