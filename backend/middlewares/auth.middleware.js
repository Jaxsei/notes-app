import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCode } from "../utils/StatusCode.js";

/**
 * @middleware protectRoute
 * @desc Protect routes by verifying JWT and attaching user to request
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If token is missing, invalid, expired, or user not found
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Prefer cookie, fallback to Authorization header
    let token =
      req.cookies?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return next(
        new ApiError(
          StatusCode.UNAUTHORIZED,
          "Unauthorized - No token provided"
        )
      );
    }

    // Ensure secret exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment");
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return next(
        new ApiError(
          StatusCode.UNAUTHORIZED,
          "Unauthorized - Invalid or expired token"
        )
      );
    }

    const userId = decoded?.userId || decoded?._id;

    if (!userId) {
      return next(
        new ApiError(StatusCode.UNAUTHORIZED, "Invalid token payload")
      );
    }

    // Fetch user (exclude sensitive fields)
    const user = await User.findById(userId).select(
      "_id username email avatar isVerified"
    );

    if (!user) {
      return next(new ApiError(StatusCode.NOT_FOUND, "User not found"));
    }

    // Attach safe user object
    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    return next();
  } catch (error) {
    // Avoid leaking internal errors
    return next(
      new ApiError(
        StatusCode.UNAUTHORIZED,
        "Unauthorized - Authentication failed"
      )
    );
  }
};

