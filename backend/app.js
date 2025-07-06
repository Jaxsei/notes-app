import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';


const __dirname = path.resolve();


// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export { app };
