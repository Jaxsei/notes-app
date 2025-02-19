import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller.js';
import { protectRoute } from '../middlewares/auth.middelware.js';
import { noteLimiter, getNotesLimiter } from '../utils/NotesRateLimiter.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post('/', protectRoute, noteLimiter, upload.none(), createNote);
router.get('/', protectRoute, getNotesLimiter, upload.none(), getNotes);
router.put('/:id', protectRoute, noteLimiter, upload.none(), updateNote);
router.delete('/:id', protectRoute, noteLimiter, upload.none(), deleteNote);

export default router;
