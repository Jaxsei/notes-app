import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import multer from 'multer'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
//const upload = multer()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json({ limit: '50mb' }));   // For JSON data
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For form data
app.use(cookieParser());
app.use(upload.none());  // This ensures that multer handles the form data properly


// Routes declaration
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import { upload } from "./middlewares/multer.middleware.js";

app.use('/api/v1/auth', authRoutes);  // Keep auth under /api/v1/auth
app.use('/api/v1/notes', noteRoutes);  // Notes should have a separate endpoint
export { app }
