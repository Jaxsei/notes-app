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
 * @route POST /note/
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Create Note
export const createNote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, content }: { title: string, content: string | { ops: any[] } } = req.body;

  if (!title || !content) {
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
 * @route POST /note/
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Get All Notes
export const getNotes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, notes, 'Notes retrieved successfully'));
});


/**
 * @description Updates note with title and content
 *
 * @route POST /note/:id
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */

// Update Note
export const updateNote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content }: { title?: string, content?: string | { ops: any[] } } = req.body;

  const formattedContent =
    typeof content === "string"
      ? { ops: [{ insert: content }] }
      : content;

  const note = await Note.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { title, content: formattedContent },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, note, 'Note updated successfully'));
});


/**
 * @description Deletes note 
 *
 * @route POST /note/:id
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
