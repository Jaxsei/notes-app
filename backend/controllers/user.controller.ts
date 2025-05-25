import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from 'bcryptjs';
import validator from "validator";
import { Request, Response } from 'express';
import { StatusCode } from "../utils/StatusCode";

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


// Before running any of these Functions, A middleware called protectRoute will run in user.routes.js for security purposes 

interface AuthenticationBody {
  email: string;
  username: string;
  password: string;
}

interface CustomRegisterRequest extends Request {
  body: AuthenticationBody;
  file?: Express.Multer.File;
}

/**
 * @description Registers a new user with email, username, password, and avatar.
 * Validates input, uploads avatar, saves user, and returns tokens.
 *
 * @route POST /auth/signup
 * @param {CustomRequest} req - Request with body and optional avatar file.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */


export const registerUser = asyncHandler(async (req: CustomRegisterRequest, res: Response) => {
  let { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }

  username = username?.toLowerCase();
  email = email?.toLowerCase();

  if (!validator.isEmail(email)) {
    throw new ApiError(StatusCode.BAD_REQUEST, 'Invalid email format')
  }


  if (username.length < 4) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Username must be atleast 4 characters")
  }


  if (password.length < 8) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Password must be at least 8 characters");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(StatusCode.CONFLICT, "User with email or username already exists");
  }
  // console.log("User found: ", existedUser);

  const fileBuffer = req.file?.buffer;
  if (!fileBuffer) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Avatar file is required");
  }

  // console.log('avatar file found: ', fileBuffer);

  const avatar = await uploadOnCloudinary(fileBuffer, req.body?.username);
  console.log(avatar);
  if (!avatar) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Avatar upload failed");
  }

  // console.log('avatar uploaded: ', avatar);

  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
  // console.log('Password hashed: ', hashedPassword);

  if (!hashedPassword) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Password hashing failed");
  }


  const user = await User.create({
    avatar: avatar.url,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
    isVerified: false
  });

  // console.log('User created: ', user);
  if (!user) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "User creation failed");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV, // Set to true in production
    sameSite: "strict",
    maxAge: 12 * 24 * 60 * 60 * 1000, // 7 days
  });

  // console.log('refreshToken set: ', refreshToken);

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
      isVerified: user.isVerified
    }
  }, "User registered successfully"));

  // console.log('response logged');
});

interface CustomLoginRequest extends Request {
  body: AuthenticationBody;
}
/**
 * @description Logins user with email, username, password
 *
 * @route POST /auth/login
 * @param {CustomRequest} req - Request with body
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */

// LoginUser
export const loginUser = asyncHandler(async (req: CustomLoginRequest, res: Response) => {
  let { username, email, password }: { username: string, email: string, password: string } = req.body;
  //console.log(req.body.username, req.body.email) // Debug

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(StatusCode.BAD_REQUEST, "All fields are required");
  }

  username = username?.toLowerCase();
  email = email?.toLowerCase();

  // Debugging: Print input values
  //console.log("Login Attempt:", { username, email });

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  //console.log("Found User:", user); // Debugging

  if (!user) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid email or username");
  }

  // console.log('Found user: ', user);


  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid credentials");
  }

  // console.log('Password correct?: ', isPasswordCorrect ? true : false);

  const { accessToken, refreshToken } = generateTokens(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Creation of authentication token failed")
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // Shorter lifespan (15 mins)
  });

  //   console.log(`
  // accessToken: ${accessToken}
  // refreshToken: ${refreshToken}
  //
  // `);

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
    }
  }, "User login successfully"));

});


/**
 * @description Logsout user
 *
 * @route POST /auth/logout
 * @param {CustomRequest} req - Request with body
 * @returns {Promise<void>}
 */


// Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logged out successfully"));
})
