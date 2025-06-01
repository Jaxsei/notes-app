import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
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
// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
if (process.env.NODE_ENV === "production") {
    const rootPath = path.join(__dirname, "../../");
    app.use(express.static(path.join(rootPath, "frontend", "dist")));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(rootPath, "frontend", "dist", "index.html"));
    });
}
export { app };
//# sourceMappingURL=app.js.map