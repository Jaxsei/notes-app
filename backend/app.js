import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json({ limit: '50mb' }));   // For JSON data
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For form data
app.use(cookieParser());


// Routes declaration
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';

app.use('/api/v1/auth', authRoutes);  // Keep auth under /api/v1/auth
app.use('/api/v1/notes', noteRoutes);  // Notes should have a separate endpoint
export { app }
