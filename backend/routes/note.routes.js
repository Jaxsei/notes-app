import express from 'express';
import { createNote, getNotes, updateNote, deleteNote, getANote } from '../controllers/note.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { noteLimiter, getNotesLimiter } from '../utils/NotesRateLimiter.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();
// Note Routes 
router.post('/create', protectRoute, noteLimiter, upload.none(), createNote);
router.get('/get', protectRoute, getNotesLimiter, upload.none(), getNotes);
router.get('/get/:id', protectRoute, getNotesLimiter, upload.none(), getANote);
router.put('/update/:id', protectRoute, noteLimiter, upload.none(), updateNote);
router.delete('/delete/:id', protectRoute, noteLimiter, upload.none(), deleteNote);
export default router;
//# sourceMappingURL=note.routes.js.map