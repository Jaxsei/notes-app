import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import multer from 'multer'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const upload = multer()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static('public'))
app.use(upload.none())


// Routes declaration
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';

app.use('/api/v1/auth', upload.none(), authRoutes);  // Keep auth under /api/v1/auth
app.use('/api/v1/notes', noteRoutes);  // Notes should have a separate endpoint
export { app }
