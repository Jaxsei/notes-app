import { asyncHandler } from '../utils/asyncHandler';
import { Note } from '../models/note.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { StatusCode } from '../utils/StatusCode';
import { Request, Response } from 'express';


// Before running any of these Functions, A middleware called protectRoute will run in note.routes.ts for security purposes 

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
  };
}



/**
 * @description Creates note with title and content
 *
 * @route POST /note/create
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Create Note
export const createNote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, content }: { title: string, content: string | { ops: any[] } } = req.body;

  if (!title) {
    throw new ApiError(StatusCode.BAD_REQUEST, 'Title and content are required');
  }

  const formattedContent =
    typeof content === "string"
      ? { ops: [{ insert: content }] }
      : content;

  const note = await Note.create({
    title,
    content: formattedContent,
    owner: req.user._id
  });

  if (!note) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Failed to create note');
  }

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, note, 'Note created successfully'));
});



/**
 * @description Gets all notes
 *
 * @route POST /note/get
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Get All Notes
export const getNotes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, notes, 'Notes retrieved successfully'));
});



/**
 * @description Gets a specific notes
 *
 * @route GET /note/get/:id
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// GETS a note
export const getANote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.id;

  if (!noteId) {
    throw new ApiError(StatusCode.NOT_FOUND, null, 'noteId not found')
  }

  const note = await Note.findOne({ _id: noteId, owner: req.user._id });

  if (!note) {
    return res
      .status(StatusCode.NOT_FOUND)
      .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Note not found"));
  }

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, note, "Note retrieved successfully"));
});

/**
 * @description Updates note with title and content
 *
 * @route POST /note/update/:id
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Update Note
export const updateNote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  console.log(id, updates);
  // Optional: if content is present, format it
  if (updates.content) {
    updates.content =
      typeof updates.content === "string"
        ? { ops: [{ insert: updates.content }] }
        : updates.content;
  }

  console.log("Updating Note ID:", id, "for User:", req.user._id);
  const note = await Note.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }
  res.status(StatusCode.OK).json(
    new ApiResponse(StatusCode.OK, note, 'Note updated successfully')
  );
});

/**
 * @description Deletes note 
 *
 * @route POST /note/delete/:id
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Delete Note
export const deleteNote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const note = await Note.findOneAndDelete({ _id: id, owner: req.user._id });

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, 'Note deleted successfully'));
});
