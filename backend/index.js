import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import courseRoute from "./routes/courseRoute.js"
import progressRoute from "./routes/progressRoute.js"
import videoNoteRoute from "./routes/videoNoteRoute.js"
import { deleteFileFromS3, downloadResources, generateUploadURL } from "./controllers/uploadController.js";
import paymentRoute from "./routes/paymentRoute.js"
import webwookRoute from "./routes/webhookRoute.js"
import studentRoute from "./routes/studentRoute.js"
import profileRoute from "./routes/profileRoute.js"

import qnaRoute from "./routes/qnaRoute.js"
import performanceRoute from "./routes/performanceRoute.js"
import announcementRoute from "./routes/announcement.js";
import reviewRoute from "./routes/reviewRoute.js";
import favoriteRoute from "./routes/favoriteRoute.js";
import lectureQuestionRoute from "./routes/lectureQuestionRoute.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
  ],
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
app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoute);
app.use('/api/video-notes', videoNoteRoute);
app.post("/api/generateUploadURL", generateUploadURL)
app.use('/api/progress', progressRoute);
app.delete("/api/deleteFile", deleteFileFromS3);
app.use('/api/checkout', paymentRoute)
app.use("/api/webhooks", webwookRoute)
app.get("/api/downloadResources", downloadResources)

app.use('/api/profile', profileRoute)

app.use('/api/qna', qnaRoute)

app.use('/api/performance', performanceRoute)

app.use("/api/announcement", announcementRoute);
app.use("/api/review", reviewRoute);
app.use("/api/favorites", favoriteRoute);

app.use("/api/instructor/students", studentRoute);

app.use("/api/lectureQuestions", lectureQuestionRoute);



app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});