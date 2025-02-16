import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { generateRefreshAccessTokens } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register",
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1
    },
    {
      name: 'coverImage',
      maxCount: 1
    }
  ]), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/refresh", generateRefreshAccessTokens);

export default router;
