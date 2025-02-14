import multer from "multer";
import path from "path";

// 🛠 Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Stores files in /public/temp
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  }
});

// 🛡 File Type & Size Limits
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .png, .jpeg, .jpg files are allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});
