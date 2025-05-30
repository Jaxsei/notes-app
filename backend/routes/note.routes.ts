import express from 'express';
import { createNote, getNotes, updateNote, deleteNote, getANote } from '../controllers/note.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { noteLimiter, getNotesLimiter } from '../utils/NotesRateLimiter';
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

// Note Routes 
router.post('/create', protectRoute, noteLimiter, upload.none(), createNote);
router.get('/get', protectRoute, getNotesLimiter, upload.none(), getNotes);
router.get('/get/:id', protectRoute, getNotesLimiter, upload.none(), getANote);
router.put('/update/:id', protectRoute, noteLimiter, upload.none(), updateNote);
router.delete('/delete/:id', protectRoute, noteLimiter, upload.none(), deleteNote);

export default router;
