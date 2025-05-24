import express from "express";
import { registerUser, loginUser, logoutUser, generateTokens } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { RateLimiter } from "../utils/RateLimiter";
import { sendOtp, verifyOtp } from "../controllers/otp.controller";
import { protectRoute } from "../middlewares/auth.middelware";

const router = express.Router();

// AUTH ROUTES
router.post("/signup", RateLimiter(), upload.single('avatar'), registerUser);
router.post("/login", RateLimiter(), upload.none(), loginUser);
router.post("/logout", upload.none(), logoutUser);
router.get("/refresh", RateLimiter(), upload.none(), generateTokens);
router.post("/sendotp", protectRoute, RateLimiter(3), upload.none(), sendOtp)
router.post("/verifyotp", protectRoute, RateLimiter(3), upload.none(), verifyOtp)

export default router;
