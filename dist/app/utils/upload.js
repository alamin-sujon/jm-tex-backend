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
exports.initCloudinary = initCloudinary;
exports.uploadImageBuffer = uploadImageBuffer;
exports.slugifyFilename = slugifyFilename;
exports.getOptimizedImageUrl = getOptimizedImageUrl;
exports.deleteImageByPublicId = deleteImageByPublicId;
exports.extractPublicIdFromCloudinaryUrl = extractPublicIdFromCloudinaryUrl;
exports.deleteImageByUrl = deleteImageByUrl;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
let isConfigured = false;
function initCloudinary() {
    cloudinary_1.v2.config({
        cloud_name: config_1.default.cloudinary_cloud_name,
        api_key: config_1.default.cloudinary_api_key,
        api_secret: config_1.default.cloudinary_api_secret,
        secure: true,
    });
    isConfigured = true;
}
function ensureConfigured() {
    if (!isConfigured) {
        throw new Error('Cloudinary not configured. Call initCloudinary(...) once at app startup.');
    }
}
/**
 * Uploads an image (remote URL / local path / base64 / buffer stream via upload_stream).
 */
function uploadImageBuffer(buffer_1) {
    return __awaiter(this, arguments, void 0, function* (buffer, options = {}) {
        ensureConfigured();
        return new Promise((resolve, reject) => {
            var _a, _b;
            const stream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: (_a = options.resourceType) !== null && _a !== void 0 ? _a : 'image',
                folder: options.folder,
                public_id: options.publicId,
                overwrite: (_b = options.overwrite) !== null && _b !== void 0 ? _b : true,
            }, (error, result) => {
                if (error || !result)
                    return reject(error);
                resolve({
                    publicId: result.public_id,
                    secureUrl: result.secure_url,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    bytes: result.bytes,
                });
            });
            stream.end(buffer);
        });
    });
}
function slugifyFilename(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\.[a-z0-9]+$/i, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}
/**
 * Creates an optimized delivery URL for an existing uploaded image publicId.
 * - Auto format + auto quality by default
 * - Optional resize/crop
 */
function getOptimizedImageUrl(publicId, opts = {}) {
    var _a, _b, _c;
    ensureConfigured();
    return cloudinary_1.v2.url(publicId, {
        fetch_format: (_a = opts.format) !== null && _a !== void 0 ? _a : 'auto',
        quality: (_b = opts.quality) !== null && _b !== void 0 ? _b : 'auto',
        dpr: (_c = opts.dpr) !== null && _c !== void 0 ? _c : 'auto',
        // resizing options (only applied if width/height provided)
        width: opts.width,
        height: opts.height,
        crop: opts.crop,
        gravity: opts.gravity,
    });
}
/**
 * Deletes an uploaded asset by publicId.
 */
function deleteImageByPublicId(publicId_1) {
    return __awaiter(this, arguments, void 0, function* (publicId, resourceType = 'image') {
        ensureConfigured();
        // Cloudinary returns: { result: "ok" | "not found" }
        const res = yield cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true, // helps clear CDN cache
        });
        return res;
    });
}
/**
 * If you stored only the URL, this tries to extract publicId from a Cloudinary URL.
 * Works for common patterns like:
 * https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
 */
function extractPublicIdFromCloudinaryUrl(url) {
    var _a;
    try {
        const u = new URL(url);
        const parts = u.pathname.split('/');
        // find "upload" index
        const uploadIdx = parts.findIndex((p) => p === 'upload');
        if (uploadIdx === -1)
            return null;
        // everything after upload/, skip optional version "v123"
        const afterUpload = parts.slice(uploadIdx + 1).filter(Boolean);
        const noVersion = ((_a = afterUpload[0]) === null || _a === void 0 ? void 0 : _a.startsWith('v')) && /^\bv\d+\b$/.test(afterUpload[0])
            ? afterUpload.slice(1)
            : afterUpload;
        if (noVersion.length === 0)
            return null;
        // join rest and remove extension
        const path = noVersion.join('/');
        const publicId = path.replace(/\.[a-z0-9]+$/i, '');
        return publicId;
    }
    catch (_b) {
        return null;
    }
}
/**
 * Delete by URL (handy if DB stores only secure_url).
 */
function deleteImageByUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const publicId = extractPublicIdFromCloudinaryUrl(url);
        if (!publicId) {
            return { result: 'error', message: 'Could not extract publicId from URL.' };
        }
        const res = yield deleteImageByPublicId(publicId, 'image');
        return Object.assign({ publicId }, res);
    });
}
