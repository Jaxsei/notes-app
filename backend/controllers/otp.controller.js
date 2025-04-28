import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from 'crypto';
import { resendEmail } from "../utils/resendEmails.js";

export const sendOtp = asyncHandler(async (req, res) => {

  const { email } = req.body;
  // console.log(email);

  if (!email || typeof email !== "string") {
    throw new ApiError(400, "A valid email is required");
  }
  //const user = await User.findById(req.user.id);
  //if (!user) {
  //  throw new ApiError(404, "User not found");
  //}
  //
  //if (user.isVerified) {
  //  throw new ApiError(400, "Email is already verified");
  //}
  //
  // Generate OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  //user.otp = {
  //  code: otpCode,
  //  expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
  //};

  //await user.save();

  await resendEmail(email, otpCode);

  res.json(new ApiResponse(200, {}, "OTP sent to your email"));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || !user.otp || user.otp.code !== otp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (user.otp.expiresAt < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  user.isVerified = true;
  user.otp = undefined; // Remove OTP after successful verification

  await user.save();

  res.json(new ApiResponse(200, {}, "Email verified successfully"));
});
