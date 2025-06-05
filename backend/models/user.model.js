import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [4, "Username must be at least 4 characters"],
      maxlength: [20, "Username must be under 20 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    avatar: {
      type: String, // Cloudinary URL or path
      required: [true, "Avatar URL is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      code: {
        type: String,
        select: false // prevent sending it back in API responses
      },
      expiresAt: {
        type: Date,
        select: false
      }
    }
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);
