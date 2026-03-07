
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type UploadOptions = {
  folder?: string;
  publicId?: string; // without extension
  overwrite?: boolean;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
};

type OptimizeOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb' | 'pad' | 'crop';
  gravity?: string; // e.g. "auto"
  quality?: 'auto' | number; // e.g. "auto:good"
  format?: 'auto' | string; // e.g. "webp"
  dpr?: 'auto' | number;
};

let isConfigured = false;

export function initCloudinary() {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
    secure: true,
  });
  isConfigured = true;
}

function ensureConfigured() {
  if (!isConfigured) {
    throw new Error(
      'Cloudinary not configured. Call initCloudinary(...) once at app startup.',
    );
  }
}

/**
 * Uploads an image (remote URL / local path / base64 / buffer stream via upload_stream).
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  options: UploadOptions = {},
) {
  ensureConfigured();

  return new Promise<{
    publicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resourceType ?? 'image',
        folder: options.folder,
        public_id: options.publicId,
        overwrite: options.overwrite ?? true,
      },
      (error, result) => {
        if (error || !result) return reject(error);

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    stream.end(buffer);
  });
}

export function slugifyFilename(name: string) {
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
export function getOptimizedImageUrl(
  publicId: string,
  opts: OptimizeOptions = {},
) {
  ensureConfigured();

  return cloudinary.url(publicId, {
    fetch_format: opts.format ?? 'auto',
    quality: opts.quality ?? 'auto',
    dpr: opts.dpr ?? 'auto',

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
export async function deleteImageByPublicId(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
) {
  ensureConfigured();

  // Cloudinary returns: { result: "ok" | "not found" }
  const res = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true, // helps clear CDN cache
  });

  return res;
}

/**
 * If you stored only the URL, this tries to extract publicId from a Cloudinary URL.
 * Works for common patterns like:
 * https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
 */
export function extractPublicIdFromCloudinaryUrl(url: string) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');

    // find "upload" index
    const uploadIdx = parts.findIndex((p) => p === 'upload');
    if (uploadIdx === -1) return null;

    // everything after upload/, skip optional version "v123"
    const afterUpload = parts.slice(uploadIdx + 1).filter(Boolean);

    const noVersion =
      afterUpload[0]?.startsWith('v') && /^\bv\d+\b$/.test(afterUpload[0])
        ? afterUpload.slice(1)
        : afterUpload;

    if (noVersion.length === 0) return null;

    // join rest and remove extension
    const path = noVersion.join('/');
    const publicId = path.replace(/\.[a-z0-9]+$/i, '');
    return publicId;
  } catch {
    return null;
  }
}

/**
 * Delete by URL (handy if DB stores only secure_url).
 */
export async function deleteImageByUrl(url: string) {
  const publicId = extractPublicIdFromCloudinaryUrl(url);
  if (!publicId) {
    return { result: 'error', message: 'Could not extract publicId from URL.' };
  }
  const res = await deleteImageByPublicId(publicId, 'image');
  return { publicId, ...res };
}
