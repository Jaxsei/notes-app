import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

// Security Middleware
export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  //console.log("Authenticated User in Middleware:", req.user);
  //console.log('cookie:', req.cookies)              Debugging
  //console.log('Token:', token)
  //console.log('secret: ', process.env.JWT_SECRET)

  // Failsafe Token
  if (!token) {
    throw new ApiError(401, "Unauthorized - No Token Provided");
  }

  try {
    // Verify Token with a secret code
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User by Id but exclude password
    const user = await User.findById(decoded.userId).select("-password");

    // Failsafe user
    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found");
    }

    // Store user in req
    req.user = user;

    // Pass to next function
    next();
  } catch (error) {
    // Catch Errors
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized - Token Expired");
    }
    throw new ApiError(401, "Unauthorized - Invalid Token");
  }
});
