import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { StatusCode } from '../utils/StatusCode.js';
export const protectRoute = async (req, res, next) => {
    console.log(">>> protectRoute middleware executed");
    try {
        // Get token from either cookie or Authorization header
        let token = req.cookies?.refreshToken;
        console.log(token ? `refreshToken found: ' ${token}` : 'refreshToken not found: error');
        if (!token) {
            return next(new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized - No token provided"));
        }
        // Fail-safe for missing secret
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not defined in environment");
        }
        // Decode token
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId || decoded._id;
        if (!userId) {
            return next(new ApiError(StatusCode.UNAUTHORIZED, "Invalid token payload"));
        }
        // Find user
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return next(new ApiError(StatusCode.NOT_FOUND, "User not found"));
        }
        // Attach user to request
        req.user = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        };
        next();
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return next(new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized - Invalid or expired token"));
    }
};
//# sourceMappingURL=auth.middleware.js.map