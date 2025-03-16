import mongoose from "mongoose";

// User database structure
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String, //Cloudinary URL
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: { type: String, },
    expiresAt: { type: Date }
  }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema) 
