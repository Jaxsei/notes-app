import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";

// Define custom type for Request with user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to protect routes
export const protectRoute = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized - No Token Provided");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET not defined in environment variables.");
    throw new ApiError(500, "Internal Server Error");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found");
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized - Token Expired");
    }
    throw new ApiError(401, "Unauthorized - Invalid Token");
  }
});
