import express from "express";
import { addLectureQuestions, deleteLectureQuestion, getLectureQuestions, updateLectureQuestion } from "../controllers/lectureQuestionController.js";


const router = express.Router();

router.route("/:lectureId")
    .get(getLectureQuestions)
router.route("/add")
    .post(addLectureQuestions);
router.route("/update")
    .put(updateLectureQuestion);
router.route("/delete/:lectureId/:questionId")
    .delete(deleteLectureQuestion);

export default router;
    