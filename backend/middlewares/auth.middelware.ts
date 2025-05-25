import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/StatusCode";

// Define custom type for Request with user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to protect routes
export const protectRoute = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Unauthorized - No Token Provided");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET not defined in environment variables.");
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Unauthorized - User not found");
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(StatusCode.BAD_REQUEST, "Unauthorized - Token Expired");
    }
    throw new ApiError(StatusCode.BAD_REQUEST, "Unauthorized - Invalid Token");
  }
});
