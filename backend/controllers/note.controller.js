import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StatusCode } from "../utils/StatusCode.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import validate from "../utils/Validation.js";
import {
  noteSchema,
  deltaOpSchema,
  updateNoteSchema,
} from "../schemas/note.schemas.js";

/**
 * @route POST /notes/create
 * @desc Create a new note
 * @access Private
 *
 * @param {import("express").Request & { user?: any, file?: Express.Multer.File }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If validation fails or thumbnail is missing
 */
export const createNote = asyncHandler(async (req, res) => {
  const { title, content } = validate(noteSchema, req.body);

  if (!req.file?.buffer) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(
    req.file.buffer,
    req.user.username
  );

  const note = await Note.create({
    title,
    content,
    owner: req.user._id,
    thumbnail: thumbnail.url,
  });

  res
    .status(StatusCode.CREATED)
    .json(
      new ApiResponse(StatusCode.CREATED, note, "Note created successfully")
    );
});

/**
 * @route GET /notes/get
 * @desc Get all notes for the authenticated user
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 */
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ owner: req.user?._id }).sort({
    createdAt: -1,
  });

  console.log("Note GET all successfully");

  res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(StatusCode.OK, notes, "Notes retrieved successfully")
    );
});

/**
 * @route GET /notes/get/:id
 * @desc Get a specific note by ID
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If note ID is missing or note not found
 */
export const getANote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Note ID is required");
  }

  const note = await Note.findOne({ _id: id, owner: req.user?._id });

  if (!note) {
    throw new ApiError(StatusCode.NOT_FOUND, "Note not found");
  }

  console.log("Note GET one successfully");

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, note, "Note retrieved successfully"));
});

/**
 * @route PUT /notes/update/:id
 * @desc Update a note
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If validation fails or note not found
 */
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = validate(updateNoteSchema, req.body);

  if (!id?.trim()) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Note ID is required");
  }

  const note = await Note.findOneAndUpdate(
    { _id: id, owner: req.user?._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(StatusCode.NOT_FOUND, "Note not found");
  }

  console.log("Note updated successfully");

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, note, "Note updated successfully"));
});

/**
 * @route DELETE /notes/delete/:id
 * @desc Delete a note
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If note ID is missing or note not found
 */
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Note ID is required");
  }

  const note = await Note.findOneAndDelete({
    _id: id,
    owner: req.user?._id,
  });

  if (!note) {
    throw new ApiError(StatusCode.NOT_FOUND, "Note not found");
  }

  console.log("Note deleted successfully");

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, {}, "Note deleted successfully"));
});

