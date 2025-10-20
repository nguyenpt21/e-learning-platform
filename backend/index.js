import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import courseRoute from "./routes/courseRoute.js"
import { deleteFileFromS3, generateUploadURL } from "./controllers/uploadController.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Kết nối DB với try/catch
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, Express!' });
});

// Mount routes
app.use("/api/auth", authRoutes)
app.use('/api/courses', courseRoute);
app.post("/api/generateUploadURL", generateUploadURL)
app.delete("/api/deleteFile", deleteFileFromS3);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
