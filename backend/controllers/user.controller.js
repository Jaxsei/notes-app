import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCode } from '../utils/StatusCode.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import dotenv from 'dotenv';
import { z } from "zod";
import validate from "../utils/Validation.js";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
if (!JWT_SECRET || !ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY) {
  throw new Error("SECRET is not defined in environment variables.");
}


const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge,
});


export const generateTokens = (userId) => {
  if (!userId)
    throw new Error("generateTokens: userId is required.");
  const payload = { userId };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  if (!refreshToken || !accessToken) {
    throw new Error("generateTokens: failed")
  }

  return { accessToken, refreshToken };
};


const validateSchema = z.object({
  email: z.string().email(),
  username: z.string().min(5).toLowerCase(),
  password: z.string().min(8).toLowerCase(),
})


export const registerUser = asyncHandler(async (req, res) => {

  let { username, password, email } = validate(validateSchema, req.body)

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



export const loginUser = asyncHandler(async (req, res) => {
  let { username, password, email } = validate(validateSchema, req.body)


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



export const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie("refreshToken", getCookieOptions(0));
  console.log('User logout successfully');
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logged out successfully"));
});



export const checkAuth = asyncHandler(async (req, res) => {

  if (!req.user) {
    throw new ApiError(StatusCode.Unauthorized, 'User not found')
  }

  console.log('successfully checked for auth');
  res.status(StatusCode.OK).json(req.user);
});



const updateProfileSchema = validateSchema.omit({ password: true })

export const updateProfile = asyncHandler(async (req, res) => {
  let { username, email } = validate(updateProfileSchema, req.body)

  if (!req.user?._id) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

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
  let { username, email } = validate(updateProfileSchema, req.body)

  if (!req.user?._id) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
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

  user.email = email;
  user.username = username;

  await user.save();

  res.status(StatusCode.OK).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isVerified: user.isVerified,
  });
});
