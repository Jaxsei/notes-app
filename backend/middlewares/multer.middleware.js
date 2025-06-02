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
// File filter to validate MIME types
const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported image format. Allowed: PNG, JPEG, JPG, WEBP, GIF, SVG, AVIF, BMP, HEIC, HEIF"));
    }
    cb(null, true);
};
// Multer configuration with memory storage and limits
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024 // 10MB
    },
    fileFilter
});
//# sourceMappingURL=multer.middleware.js.map