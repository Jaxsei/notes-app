import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../utils/StatusCode";

// Optional: Custom Request type with user
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log(">>> protectRoute middleware executed");

  try {
    const token = req.cookies?.refreshToken;
    console.log("refreshToken:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId || decoded._id).select("-password");
    // console.log("Authenticated user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};
