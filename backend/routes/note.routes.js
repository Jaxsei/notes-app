import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller.js';
import { protectRoute } from '../middlewares/auth.middelware.js';

const router = express.Router();

router.post('/', protectRoute, createNote);
router.get('/', protectRoute, getNotes);
router.put('/:id', protectRoute, updateNote);
router.delete('/:id', protectRoute, deleteNote);

export default router;
