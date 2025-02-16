import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import multer from 'multer'

const app = express();
const upload = multer()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())


// Routes declaration
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/auth", upload.none(), authRoutes);


export { app }
