import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getANote,
} from "../controllers/note.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { noteLimiter, getNotesLimiter } from "../utils/NotesRateLimiter.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/notes/create
 * @desc    Create a new note with thumbnail
 * @access  Private
 */
router.post(
  "/create",
  protectRoute,
  noteLimiter,
  upload.single("thumbnail"),
  createNote
);

/**
 * @route   GET /api/v1/notes/get
 * @desc    Get all notes of authenticated user
 * @access  Private
 */
router.get("/get", protectRoute, getNotesLimiter, upload.none(), getNotes);

/**
 * @route   GET /api/v1/notes/get/:id
 * @desc    Get a single note by ID
 * @access  Private
 */
router.get("/get/:id", protectRoute, getNotesLimiter, upload.none(), getANote);

/**
 * @route   PUT /api/v1/notes/update/:id
 * @desc    Update a note (partial updates supported)
 * @access  Private
 */
router.put("/update/:id", protectRoute, noteLimiter, upload.none(), updateNote);

/**
 * @route   DELETE /api/v1/notes/delete/:id
 * @desc    Delete a note by ID
 * @access  Private
 */
router.delete(
  "/delete/:id",
  protectRoute,
  noteLimiter,
  upload.none(),
  deleteNote
);

export default router;

