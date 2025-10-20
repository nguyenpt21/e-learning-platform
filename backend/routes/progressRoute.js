import express from "express";
import {
    updateLectureProgress,
    updateQuizProgress,
    getCourseProgress,
    getAllUserItemsProgress,
} from "../controllers/progressController.js";
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/lecture", updateLectureProgress);
router.post("/quiz", updateQuizProgress);

router.get("/course/:courseId", protectRoute, getCourseProgress);
router.get("/course/:courseId/items", protectRoute, getAllUserItemsProgress);

export default router;