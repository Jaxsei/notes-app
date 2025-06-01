import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";

// Create the Express app
const app = express();

// Middleware
app.set("trust proxy", 1);

app.use(cors({
  origin: 'http://localhost:5173', // Change this to your deployed frontend URL in production
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);


const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
export { app };
