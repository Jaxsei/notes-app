import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from 'crypto';
import { resendEmail } from "../utils/resendEmails";
import { StatusCode } from "../utils/StatusCode";
import { Request, Response } from 'express';
import { Document } from "mongoose";


interface AuthenticatedRequest extends Request {
  user: {
    _id: string
  }
}



/**
 * @description Sends otp througu given email and 
 * stores in db
 *
 * @route POST /sendOtp/
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */


export const sendOtp = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

  const { email }: { email: string } = req.body;
  // console.log(email);

  if (!email || typeof email !== "string") {
    throw new ApiError(StatusCode.BAD_REQUEST, "A valid email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCode.BAD_REQUEST, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Email is already verified");
  }

  const otpCode = crypto.randomInt(10000000, 99999999).toString();
  if (!otpCode) {
    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Creation of otpCode failed')
  }


  user.otp = {
    code: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
  };

  await user.save();

  await resendEmail(email, otpCode);

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, "Email sent successfully"));
});

interface UserModel extends Document {
  isVerified: boolean
  otp?: {
    code: string,
    expiresAt: Date
  }
}


/**
 * @description Verify otp by comparing the one given
 * and the one stored in db
 *
 * @route POST /verifyOtp/
 * @param {AuthenticatedRequest} req - Request with body
 * @returns {Promise<void>}
 */


export const verifyOtp = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { otp }: { otp: string } = req.body;
  const user = await User.findById(req.user._id) as UserModel;

  if (!user) {
    throw new ApiError(StatusCode.BAD_REQUEST, 'User not found')
  }

  console.log(user.email);

  if (!user.otp.code) {
    throw new ApiError(StatusCode.BAD_REQUEST, 'Otp not found')
  }

  if (user.otp.code !== otp || user.otp.expiresAt?.getTime() < Date.now()) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid or expired OTP");
  }



  user.isVerified = true;
  user.otp = undefined; // Remove OTP after successful verification

  await user.save();

  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, {}, "Email verified successfully"));
});
