import express from "express";
import { registerUser, loginUser, logoutUser, generateTokens } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { RateLimiter } from "../utils/RateLimiter.js";

const router = express.Router();


// AUTH ROUTES
router.post("/register", RateLimiter, upload.single('avatar'), registerUser);
router.post("/login", RateLimiter, upload.none(), loginUser);
router.post("/logout", upload.none(), logoutUser);
router.get("/refresh", RateLimiter, upload.none(), generateTokens);

export default router;
