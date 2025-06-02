import crypto from "crypto";
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { resendEmail } from '../utils/resendEmails.js';
import { StatusCode } from '../utils/StatusCode.js';
/**
 * @route   POST /sendOtp
 * @desc    Generates OTP and sends it via email to the user
 * @access  Public
 */
// @ts-ignore
export const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email?.trim()) {
        throw new ApiError(StatusCode.BAD_REQUEST, "A valid email is required");
    }
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
        throw new ApiError(StatusCode.NOT_FOUND, "User not found");
    }
    if (user.isVerified) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Email is already verified");
    }
    const otpCode = crypto.randomInt(10000000, 99999999).toString();
    user.otp = {
        code: otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };
    await user.save();
    await resendEmail(email.trim(), otpCode);
    console.log("✅ OTP email sent to:", email);
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, "Email sent successfully"));
});
/**
 * @route   POST /verifyOtp
 * @desc    Verifies the OTP sent to user's email
 * @access  Private (requires authenticated user)
 */
// @ts-ignore
export const verifyOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (!otp?.trim()) {
        throw new ApiError(StatusCode.BAD_REQUEST, "OTP is required");
    }
    const user = (await User.findById(req.user._id));
    if (!user) {
        throw new ApiError(StatusCode.NOT_FOUND, "User not found");
    }
    const storedOtp = user.otp;
    if (!storedOtp || !storedOtp.code || !storedOtp.expiresAt) {
        throw new ApiError(StatusCode.BAD_REQUEST, "No OTP found for user");
    }
    const isExpired = storedOtp.expiresAt.getTime() < Date.now();
    const isMismatch = storedOtp.code !== otp.trim();
    if (isExpired || isMismatch) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Invalid or expired OTP");
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    console.log("✅ OTP verified for:", user._id);
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, "Email verified successfully"));
});
//# sourceMappingURL=otp.controller.js.map