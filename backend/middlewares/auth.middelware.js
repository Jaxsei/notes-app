import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1] || req.body.token;
  if (!token) {
    throw new ApiError(401, "Unauthorized - No Token Provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'athanasia');
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized - Token Expired");
    }
    throw new ApiError(401, "Unauthorized - Invalid Token");
  }
});
