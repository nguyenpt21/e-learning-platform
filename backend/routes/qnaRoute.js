import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js"
import { createComment, createQNA, createReply, getQnAById, getQnAByPage, updateReactionComment, updateReactionReply } from "../controllers/qnaController.js";
const router = express.Router();

router.post("/createQnA", protectRoute, createQNA)
router.get("/:qnaId", protectRoute, getQnAById)
router.get("/", protectRoute, getQnAByPage)

router.post("/:qnaId/comment", protectRoute, createComment)
router.put("/:qnaId/comment/:commentId/reaction", protectRoute, updateReactionComment)

router.post("/:qnaId/comment/:commentId/reply", protectRoute, createReply)
router.put("/:qnaId/comment/:commentId/reply/:replyId/reaction", protectRoute, updateReactionReply)

export default router;