import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// Allowed image MIME types
const allowedTypes: string[] = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/heic",
  "image/heif"
];

// File filter to validate MIME types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Unsupported image format. Allowed: PNG, JPEG, JPG, WEBP, GIF, SVG, AVIF, BMP, HEIC, HEIF"
      )
    );
  }
  cb(null, true);
};

// Multer configuration with memory storage and limits
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter
});
