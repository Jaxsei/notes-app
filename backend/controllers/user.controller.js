import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'

// Generate Access & Refresh Tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'athanasia',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' } // Shorter expiry for access token
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'athanasia',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' } // Longer expiry for refresh token
  );

  return { accessToken, refreshToken };
};
// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  username = username?.toLowerCase();
  email = email?.toLowerCase();


  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle avatar upload
  const avatarImageLocalPath = req.file?.path;
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

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Store refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV, // Set to true in production
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
  console.log(req.body.username, req.body.email)

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

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Set refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Set access token as HTTP-only cookie (NEW)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // Shorter lifespan (15 mins)
  });

  // Send response
  res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
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
