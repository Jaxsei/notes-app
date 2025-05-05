import multer from "multer";

// Allowed image MIME types
const allowedTypes = [
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

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Unsupported image format, Supports only: Png, Jpeg, Jpg, Webp, Gif, Svg+Xml"), false);
  }
  cb(null, true);
};

// Use memory storage (no disk writes)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});
