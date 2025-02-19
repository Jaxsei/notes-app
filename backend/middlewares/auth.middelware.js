import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  //console.log("Authenticated User in Middleware:", req.user);
  //console.log('cookie:', req.cookies)              Debugging
  //console.log('Token:', token)
  //console.log('secret: ', process.env.JWT_SECRET)
  if (!token) {
    throw new ApiError(401, "Unauthorized - No Token Provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
