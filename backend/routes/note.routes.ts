import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller';
import { protectRoute } from '../middlewares/auth.middelware';
import { noteLimiter, getNotesLimiter } from '../utils/NotesRateLimiter';
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

// Note Routes 
router.post('/', protectRoute, noteLimiter, upload.none(), createNote);
router.get('/', protectRoute, getNotesLimiter, upload.none(), getNotes);
router.put('/:id', protectRoute, noteLimiter, upload.none(), updateNote);
router.delete('/:id', protectRoute, noteLimiter, upload.none(), deleteNote);

export default router;
