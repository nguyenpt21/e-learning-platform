import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js"
import { createQNA, getQnAById, getQnAByPage } from "../controllers/qnaController.js";
const router = express.Router();

router.post("/createQnA", protectRoute, createQNA)
router.get("/:qnaId", protectRoute, getQnAById)
router.get("/", protectRoute, getQnAByPage)

export default router;