import { asyncHandler } from '../utils/asyncHandler.js';
import { Note } from '../models/note.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCode } from '../utils/StatusCode.js';
// Create Note
export const createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title?.trim() || !content) {
        throw new ApiError(StatusCode.BAD_REQUEST, 'Both title and content are required');
    }
    const formattedContent = typeof content === 'string'
        ? { ops: [{ insert: content }] }
        : content;
    const note = await Note.create({
        title: title.trim(),
        content: formattedContent,
        owner: req.user?._id,
    });
    if (!note) {
        throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Failed to create note');
    }
    console.log('Note created successfully');
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, note, 'Note created successfully'));
});
// Get All Notes
export const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ owner: req.user?._id }).sort({ createdAt: -1 });
    console.log('Note GET all successfully');
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, notes, 'Notes retrieved successfully'));
});
// Get a Specific Note
export const getANote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id?.trim()) {
        throw new ApiError(StatusCode.BAD_REQUEST, 'Note ID is required');
    }
    const note = await Note.findOne({ _id: id, owner: req.user?._id });
    if (!note) {
        throw new ApiError(StatusCode.NOT_FOUND, 'Note not found');
    }
    console.log('Note GET one successfully');
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, note, 'Note retrieved successfully'));
});
// Update Note
export const updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (!id?.trim()) {
        throw new ApiError(StatusCode.BAD_REQUEST, 'Note ID is required');
    }
    if (updates.content) {
        updates.content = typeof updates.content === 'string'
            ? { ops: [{ insert: updates.content }] }
            : updates.content;
    }
    const note = await Note.findOneAndUpdate({ _id: id, owner: req.user?._id }, updates, { new: true, runValidators: true });
    if (!note) {
        throw new ApiError(StatusCode.NOT_FOUND, 'Note not found');
    }
    console.log('Note updated successfully');
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, note, 'Note updated successfully'));
});
// Delete Note
export const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id?.trim()) {
        throw new ApiError(StatusCode.BAD_REQUEST, 'Note ID is required');
    }
    const note = await Note.findOneAndDelete({ _id: id, owner: req.user?._id });
    if (!note) {
        throw new ApiError(StatusCode.NOT_FOUND, 'Note not found');
    }
    console.log('Note deleted successfully');
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, 'Note deleted successfully'));
});
//# sourceMappingURL=note.controller.js.map