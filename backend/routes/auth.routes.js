import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  updateProfile,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { RateLimiter } from "../utils/RateLimiter.js";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * =========================
 * AUTH ROUTES
 * =========================
 */

/**
 * @route POST /signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", RateLimiter(), upload.single("avatar"), registerUser);

/**
 * @route POST /login
 * @desc Login user
 * @access Public
 */
router.post("/login", RateLimiter(), upload.none(), loginUser);

/**
 * @route POST /logout
 * @desc Logout user
 * @access Private
 */
router.post("/logout", protectRoute, upload.none(), logoutUser);

/**
 * @route GET /check
 * @desc Check authenticated user
 * @access Private
 */
router.get("/check", protectRoute, RateLimiter(), upload.none(), checkAuth);

/**
 * =========================
 * OTP ROUTES
 * =========================
 */

/**
 * @route POST /sendotp
 * @desc Send OTP to user's email
 * @access Private
 */
router.post("/sendotp", protectRoute, RateLimiter(3), upload.none(), sendOtp);

/**
 * @route POST /verifyotp
 * @desc Verify OTP
 * @access Private
 */
router.post(
  "/verifyotp",
  protectRoute,
  RateLimiter(3),
  upload.none(),
  verifyOtp
);

/**
 * =========================
 * USER ROUTES
 * =========================
 */

/**
 * @route PUT /update-profile
 * @desc Update user profile (with avatar)
 * @access Private
 */
router.put(
  "/update-profile",
  protectRoute,
  RateLimiter(10),
  upload.single("avatar"),
  updateProfile
);

/**
 * @route PUT /update-user
 * @desc Update user fields (no file upload)
 * @access Private
 */
router.put(
  "/update-user",
  protectRoute,
  RateLimiter(10),
  upload.none(),
  updateUser
);

/**
 * =========================
 * TEST ROUTES (DEV ONLY)
 * =========================
 */

/**
 * @route GET /get
 * @desc Test route
 */
router.get("/get", (req, res) => {
  res.status(200).json({ message: "Hello from Nuxtake Backend" });
});

/**
 * @route POST /post
 * @desc Echo request body (testing)
 */
router.post("/post", (req, res) => {
  res.status(200).json(req.body);
});

export default router;

