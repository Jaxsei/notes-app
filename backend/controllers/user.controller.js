import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StatusCode } from "../utils/StatusCode.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import validate from "../utils/Validation.js";
import {
  updateProfileSchema,
  validateSchema,
} from "../schemas/user.schemas.js";
import {
  generateTokens,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  JWT_SECRET,
  getCookieOptions,
  endOfProcess,
} from "../utils/credentials.js";

if (!JWT_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY) {
  throw new Error("SECRET is not defined in environment variables.");
}

/**
 *
 * @route POST /auth/signup
 * @desc Registers a new User
 * @access Public
 *
 * @param {Object} req.body - Incoming request data
 * @param {string} req.body.username - User's username
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Express.Multer.File} [req.file] - Avatar image file (optional)
 *
 * @returns {Promise<ApiResponse>} Returns created user wrapped in ApiResponse
 * @throws {ApiError} If validation fails or user creation fails
 */

export const registerUser = asyncHandler(async (req, res) => {
  let { username, password, email } = validate(validateSchema, req.body);

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(
      StatusCode.CONFLICT,
      "User already exists with the provided email or username"
    );
  }

  if (!req.file?.buffer) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(req.file.buffer, username);
  if (!avatar?.url) {
    throw new ApiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Failed to upload avatar"
    );
  }
  console.log("Avatar uploaded: ", avatar.url);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    avatar: avatar.url,
    isVerified: false,
  });

  const { accessToken, refreshToken } = generateTokens(user._id.toString());
  res.cookie("refreshToken", refreshToken, getCookieOptions(endOfProcess));
  console.log("successfully registered User");
  res.status(StatusCode.OK).json(
    new ApiResponse(
      StatusCode.OK,
      {
        accessToken,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      },
      "User registered successfully"
    )
  );
});

/**
 *
 * @route POST /auth/login
 * @desc Logs in the User
 * @access Public
 *
 * @param {Object} req.body - Incoming request data
 * @param {string} req.body.username - User's username
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 *
 * @returns {Promise<ApiResponse>} Returns login user  wrapped in ApiResponse
 * @throws {ApiError} If validation fails or user creation fails
 */

export const loginUser = asyncHandler(async (req, res) => {
  let { username, password, email } = validate(validateSchema, req.body);

  const user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid credentials");
  }

  const { accessToken, refreshToken } = generateTokens(user._id.toString());
  res.cookie(
    "refreshToken",
    refreshToken,
    getCookieOptions(14 * 24 * 60 * 60 * 1000)
  );
  res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));

  console.log("Login user successfully");
  res.status(StatusCode.OK).json(
    new ApiResponse(
      StatusCode.OK,
      {
        accessToken,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
      },
      "User login successful"
    )
  );
});

/**
 *
 * @route POST /auth/logout
 * @desc Logs out the user
 * @access Private
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If logout fails
 */

export const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie("refreshToken", getCookieOptions(0));
  console.log("User logout successfully");
  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Logged out successfully"));
});

/**
 *
 * @route POST /auth/check
 * @desc checks for authenticated User
 * @access Private
 *
 * @param {import("express").Request} req - Express request object (expects req.user from auth middleware)
 * @param {import("express").Response} res - Express response object
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If user is not authenticated
 */
export const checkAuth = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(StatusCode.Unauthorized, "User not found");
  }

  console.log("successfully checked for auth");

  res.status(StatusCode.OK).json(req.user);
});

/**
 * @route   PUT /auth/update-profile
 * @desc    Update user's Profile picture
 * @access  Private
 *
 * @param {import("express").Request & { user?: any }} req - Express request (requires req.user from auth middleware)
 * @param {import("express").Response} res - Express response object
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If validation fails, user not found, or update fails
 */

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = validate(updateProfileSchema, req.body);

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  // Find current user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }

  // Check for duplicate username/email (excluding current user)
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
    _id: { $ne: userId },
  });

  if (existingUser) {
    throw new ApiError(
      StatusCode.BAD_REQUEST,
      "Email or username already in use"
    );
  }

  // Handle avatar (optional)
  let avatarUrl = user.avatar;

  if (req.file?.buffer) {
    const uploaded = await uploadOnCloudinary(req.file.buffer, username);

    if (!uploaded?.url) {
      throw new ApiError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to upload avatar"
      );
    }

    avatarUrl = uploaded.url;
  }

  // Update fields
  user.username = username;
  user.email = email;
  user.avatar = avatarUrl;

  await user.save();

  res.status(StatusCode.OK).json(
    new ApiResponse(
      StatusCode.OK,
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      "Profile updated successfully"
    )
  );
});

/**
 * @route   PUT /auth/update-user
 * @desc    Update user's basic info (username, email)
 * @access  Private
 *
 * @param {Object} req.body
 * @param {string} req.body.username - New username
 * @param {string} req.body.email - New email
 *
 * @returns {Object} Updated user data (safe fields only)
 * @throws {ApiError} If unauthorized, validation fails, or conflict occurs
 */
export const updateUser = asyncHandler(async (req, res) => {
  // Validate input
  const { username, email } = validate(updateProfileSchema, req.body);

  // Auth check (failsafe)
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  // Check for duplicate email/username (excluding current user)
  const existingUser = await User.findOne({
    _id: { $ne: userId },
    $or: [{ email }, { username }],
  }).lean();

  if (existingUser) {
    throw new ApiError(StatusCode.CONFLICT, "Email or username already in use");
  }

  // Fetch current user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }

  // Apply updates
  user.username = username;
  user.email = email;

  await user.save();

  // Response (sanitized)
  return res.status(StatusCode.OK).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isVerified: user.isVerified,
  });
});

