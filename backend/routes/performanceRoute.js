import express from "express";
import { getCourseStats, getLearningItemsCountStats, getLearningMinutesStats } from "../controllers/performanceController.js";

const router = express.Router();

router.get("/course/:courseId", getCourseStats);

router.get("/minutes-stats", getLearningMinutesStats);
router.get("/count-items-stats", getLearningItemsCountStats)

export default router;