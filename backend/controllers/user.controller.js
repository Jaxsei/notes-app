import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'

// Generate Access & Refresh Tokens
export const generateRefreshAccessTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'athanasia', // for testing purposes, dont use the visible secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'athanasia',  // for testing purposes, dont use the visible secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    });

  return { accessToken, refreshToken };
};
// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle avatar upload
  const avatarImageLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // 🔹 Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

  // 🔹 Save the user with the hashed password
  const user = await User.create({
    avatar: avatar.url,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  const { accessToken, refreshToken } = generateRefreshAccessTokens(user._id);

  // Store refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Set to true in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 🔹 Exclude password in the response
  res.status(201).json(new ApiResponse(201, {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
    }
  }, "User registered successfully"));
});




//LoginUser
export const loginUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Convert to lowercase for case-insensitive comparison
  username = username?.toLowerCase();
  email = email?.toLowerCase();

  // Debugging: Print input values
  console.log("Login Attempt:", { username, email });

  // 1. Check if user exists
  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  console.log("Found User:", user); // Debugging

  if (!user) {
    throw new ApiError(400, "Invalid email or username");
  }

  // 2. Validate password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }

  // 3. Generate tokens correctly
  const { accessToken, refreshToken } = generateRefreshAccessTokens(user._id);

  // 4. Set refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 5. Return response with access token
  res.status(200).json({
    accessToken,
    user: {
      _id: user._id,
      username: user.username, // Return username too
      email: user.email,
      avatar: user.avatar,
    },
  });
});


//logoutUser 


export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
})
