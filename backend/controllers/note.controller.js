import { asyncHandler } from '../utils/asyncHandler.js';
import { Note } from '../models/note.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


// Create Note
export const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new ApiError(400, 'Title and content are required');

  const note = await Note.create({ title, content, owner: req.user._id });

  res.status(201).json(new ApiResponse(201, note, 'Note created successfully'));
});


// Get All Notes
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notes, 'Notes retrieved successfully'));
});

// Update Note
export const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, content },
    { new: true, runValidators: true }
  );

  if (!note) throw new ApiError(404, 'Note not found');

  res.status(200).json(new ApiResponse(200, note, 'Note updated successfully'));
});


// Delete Note
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) throw new ApiError(404, 'Note not found');

  res.status(200).json(new ApiResponse(200, {}, 'Note deleted successfully'));
});


