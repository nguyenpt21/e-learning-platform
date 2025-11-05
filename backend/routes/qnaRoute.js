import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js"
import { createComment, createQNA, createReply, deleteComment, deleteReply, getQnAById, getQnAByPage, solveTheQnA, updateComment, updateReactionComment, updateReactionReply, updateReply } from "../controllers/qnaController.js";
const router = express.Router();

router.post("/createQnA", protectRoute, createQNA)
router.get("/", protectRoute, getQnAByPage)
router.get("/:qnaId", protectRoute, getQnAById)

router.put("/:qnaId/solve", protectRoute, solveTheQnA)

router.post("/:qnaId/comment", protectRoute, createComment)
router.put("/:qnaId/comment/:commentId/", protectRoute, updateComment)
router.delete("/:qnaId/comment/:commentId/", protectRoute, deleteComment)
router.put("/:qnaId/comment/:commentId/reaction", protectRoute, updateReactionComment)

router.post("/:qnaId/comment/:commentId/reply", protectRoute, createReply)
router.put("/:qnaId/comment/:commentId/reply/:replyId", protectRoute, updateReply)
router.delete("/:qnaId/comment/:commentId/reply/:replyId", protectRoute, deleteReply)
router.put("/:qnaId/comment/:commentId/reply/:replyId/reaction", protectRoute, updateReactionReply)

export default router;