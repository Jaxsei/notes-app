import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { generateTokens } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single('avatar'), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/refresh", generateTokens);

export default router;
