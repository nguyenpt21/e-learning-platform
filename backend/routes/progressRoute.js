import express from "express";
import {
    updateLectureProgress,
    updateQuizProgress,
    getCourseProgress,
    getItemProgress,
} from "../controllers/progressController.js";
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/lecture", updateLectureProgress);
router.post("/quiz", updateQuizProgress);

router.get("/course/:courseId", protectRoute, getCourseProgress);
router.get("/item/:itemId", protectRoute, getItemProgress);

export default router;