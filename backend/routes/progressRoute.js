import express from "express";
import {
    getCourseProgress,
    getAllUserItemsProgress,
    updateItemProgress,
    getItemProgress
} from "../controllers/progressController.js";
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router();

// router.post("/quiz", updateQuizProgress);
router.get("/course/:courseId", protectRoute, getCourseProgress);
router.post("/course/:courseId", protectRoute, updateItemProgress);
router.get("/course/:courseId/items", protectRoute, getAllUserItemsProgress);
router.get("/course/:courseId/section/:sectionId/item/:itemId", protectRoute, getItemProgress);

export default router;