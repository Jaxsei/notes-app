import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../utils/StatusCode.js";

/**
 * Allowed MIME types for image uploads
 */
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/heic",
  "image/heif",
]);

/**
 * Multer file filter to validate image MIME types
 *
 * @param {import("express").Request} req
 * @param {Express.Multer.File} file
 * @param {import("multer").FileFilterCallback} cb
 */
const fileFilter = (req, file, cb) => {
  if (!file?.mimetype || !ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    return cb(
      new ApiError(
        StatusCode.BAD_REQUEST,
        "Unsupported image format. Allowed: PNG, JPEG, JPG, WEBP, GIF, SVG, AVIF, BMP, HEIC, HEIF"
      )
    );
  }

  cb(null, true);
};

/**
 * Multer middleware for handling file uploads
 *
 * - Uses memory storage (buffer-based)
 * - Restricts file size
 * - Validates MIME type
 *
 * @type {import("multer").Multer}
 */
export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (fixed comment mismatch)
  },

  fileFilter,
});

