import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resendEmail } from "../utils/resendEmails.js";
import { StatusCode } from "../utils/StatusCode.js";

/**
 * @route POST /sendOtp
 * @desc Generate OTP and send it to user's email
 * @access Public
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If email is invalid, user not found, or already verified
 */
export const sendOtp = asyncHandler(async (req, res) => {
  const email = req.body?.email?.trim();

  if (!email) {
    throw new ApiError(StatusCode.BAD_REQUEST, "A valid email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Email is already verified");
  }

  const otpCode = crypto.randomInt(10000000, 99999999).toString(); // 8-digit OTP

  user.otp = {
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };

  await user.save();

  await resendEmail(email, otpCode);

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, {}, "OTP sent successfully"));
});

/**
 * @route POST /verifyOtp
 * @desc Verify OTP for authenticated user
 * @access Private
 *
 * @param {import("express").Request & { user?: any }} req
 * @param {import("express").Response} res
 *
 * @returns {Promise<void>}
 * @throws {ApiError} If OTP is invalid, expired, or user not found
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const otp = req.body?.otp?.trim();

  if (!otp) {
    throw new ApiError(StatusCode.BAD_REQUEST, "OTP is required");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCode.NOT_FOUND, "User not found");
  }

  const storedOtp = user.otp;

  if (!storedOtp?.code || !storedOtp?.expiresAt) {
    throw new ApiError(StatusCode.BAD_REQUEST, "No OTP found for user");
  }

  const isExpired = storedOtp.expiresAt.getTime() < Date.now();
  const isMismatch = storedOtp.code !== otp;

  if (isExpired || isMismatch) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid or expired OTP");
  }

  user.isVerified = true;
  user.otp = undefined;

  await user.save();

  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, {}, "Email verified successfully"));
});

