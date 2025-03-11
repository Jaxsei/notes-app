import { asyncHandler } from '../utils/asyncHandler.js';
import { Note } from '../models/note.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


// Before running any of these Functions, A middleware called protectRoute will run in note.routes.js for security purposes 

// Create Note
export const createNote = asyncHandler(async (req, res) => {
  // Debug
  console.log("User Creating Note:", req.user);
  console.log("User Creating Note:", req.user._id);

  // Get title, content
  const { title, content } = req.body;
  if (!title || !content) throw new ApiError(400, 'Title and content are required');

  // Create Note with Title, Content, Owner
  const note = await Note.create({ title, content, owner: req.user._id });

  console.log("Created Note:", note);

  // Send Response
  res.status(201).json(new ApiResponse(201, note, 'Note created successfully'));
});

// Get All Notes
export const getNotes = asyncHandler(async (req, res) => {
  //console.log("Authenticated User:", req.user); console.log("User Getting Note:", req.user._id); Debugging

  // Find Notes with Owner
  const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
  //console.log("Fetched Notes:", notes);

  // Send Response
  res.status(200).json(new ApiResponse(200, notes, 'Notes retrieved successfully'));
});

// Update Note
export const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  console.log('Body:', req.body);

  // Find Note And Update with:
  //  NoteId, Owner
  // Update Fields:
  //  Title, Content
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    {
      title: req.body.title,
      content: typeof req.body.content === "string" ? { ops: [{ insert: req.body.content }] } : req.body.content
    },
    { new: true, runValidators: true }
  );


  // Failsafe Note
  if (!note) throw new ApiError(404, 'Note not found');

  // Send Response
  res.status(200).json(new ApiResponse(200, note, 'Note updated successfully'));
});


// Delete Note
export const deleteNote = asyncHandler(async (req, res) => {

  // Find Note And Delete with:
  //  NoteId, Owner
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

  // Failsafe Note
  if (!note) throw new ApiError(404, 'Note not found');

  // Send Response
  res.status(200).json(new ApiResponse(200, {}, 'Note deleted successfully'));
});


