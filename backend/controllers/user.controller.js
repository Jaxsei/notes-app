import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCode } from '../utils/StatusCode.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import dotenv from 'dotenv';
dotenv.config();
// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge,
});
// ─────────────────────────────────────────────
// Token Generator
// ─────────────────────────────────────────────
export const generateTokens = (userId) => {
  if (!userId)
    throw new Error("generateTokens: userId is required.");
  const payload = { userId };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


  return { accessToken, refreshToken };
};



// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────



export const registerUser = asyncHandler(async (req, res) => {
  let { email, username, password } = req.body;


  if ([email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }


  email = email.toLowerCase();
  username = username.toLowerCase();


  if (!validator.isEmail(email)) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid email format");
  }
  if (username.length < 4) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Username must be at least 4 characters");
  }
  if (password.length < 8) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Password must be at least 8 characters");
  }


  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(StatusCode.CONFLICT, "User already exists with the provided email or username");
  }



  if (!req.file?.buffer) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(req.file.buffer, username);
  if (!avatar?.url) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to upload avatar");
  }
  console.log('Avatar uploaded: ', avatar.url);


  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    avatar: avatar.url,
    isVerified: false,
  });


  const { accessToken, refreshToken } = generateTokens(user._id.toString());
  res.cookie("refreshToken", refreshToken, getCookieOptions(14 * 24 * 60 * 60 * 1000));
  console.log('successfully registered User');
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  }, "User registered successfully"));
});
// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;


  if ([email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }


  const user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
  });


  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid credentials");
  }



  const { accessToken, refreshToken } = generateTokens(user._id.toString());
  res.cookie("refreshToken", refreshToken, getCookieOptions(14 * 24 * 60 * 60 * 1000));
  res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));


  console.log('Login user successfully');
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    }
  }, "User login successful"));
});


// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────



export const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie("refreshToken", getCookieOptions(0));
  console.log('User logout successfully');
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logged out successfully"));
});


// ─────────────────────────────────────────────
// Check Auth
// ─────────────────────────────────────────────


export const checkAuth = asyncHandler(async (req, res) => {

  if (!req.user) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  console.log('successfully checked for auth');
  res.status(StatusCode.OK).json(req.user);
});


// ─────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────


export const updateProfile = asyncHandler(async (req, res) => {
  let { email, username } = req.body;

  if (!req.user?._id) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }


  if ([email, username].some((field) => !field?.trim())) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }


  email = email.toLowerCase();
  username = username.toLowerCase();

  const user = await User.findOne({ $or: [{ email }, { username }] });


  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }


  if (!req.file?.buffer) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Avatar is required");
  }


  const avatar = await uploadOnCloudinary(req.file.buffer, username);
  if (!avatar?.url) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to upload avatar");
  }


  console.log('Image upload successfully');


  user.email = email;
  user.username = username;
  user.avatar = avatar.url;

  await user.save();

  res.status(StatusCode.OK).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isVerified: user.isVerified
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body;

  if (!req.user?._id) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  if ([email, username].some((field) => !field?.trim())) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }

  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.toLowerCase();

  // Ensure new email/username is not used by someone else
  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    _id: { $ne: req.user._id }
  });

  if (existingUser) {
    throw new ApiError(StatusCode.CONFLICT, "Email or username already in use");
  }

  // Update user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }

  user.email = normalizedEmail;
  user.username = normalizedUsername;

  await user.save();

  res.status(StatusCode.OK).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isVerified: user.isVerified,
  });
});
