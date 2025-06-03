import express from "express";
import { registerUser, loginUser, logoutUser, checkAuth, updateProfile, updateUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { RateLimiter } from '../utils/RateLimiter.js';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();
// AUTH ROUTES
router.post("/signup", RateLimiter(), upload.single('avatar'), registerUser);
router.post("/login", RateLimiter(), upload.none(), loginUser);
router.post("/logout", upload.none(), logoutUser);
router.get('/check', protectRoute, RateLimiter(), upload.none(), checkAuth);
router.post("/sendotp", protectRoute, RateLimiter(3), upload.none(), sendOtp);
router.post("/verifyotp", protectRoute, RateLimiter(3), upload.none(), verifyOtp);
router.put('/update-profile', protectRoute, RateLimiter(10), upload.single('avatar'), updateProfile);
router.put('/update-user', protectRoute, RateLimiter(10), upload.none(), updateUser)
export default router;
