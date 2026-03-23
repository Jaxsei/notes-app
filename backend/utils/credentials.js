import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const endOfProcess = process.env.MAX_AGE;

export const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge,
});

export const generateTokens = (userId) => {
  if (!userId) throw new Error("generateTokens: userId is required.");
  const payload = { userId };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  if (!refreshToken || !accessToken) {
    throw new Error("generateTokens: failed");
  }

  return { accessToken, refreshToken };
};

