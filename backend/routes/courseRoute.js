import express from "express";
import {
    getCourseById,
    getAllCourses,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseInfo
} from "../controllers/courseController.js";

import {
    getAllSectionsByCourse,
    getAllCurriculumItemsBySection,
    addSectionToCourse,
    updateSection,
    deleteSection,
    addLectureToSection,
    addQuizToSection,
    updateCurriculumItem,
    deleteCurriculumItem,
    deleteResourceFromLecture,
    updateQuestionInQuiz,
    deleteQuestionFromQuiz,
} from "../controllers/sectionController.js";

import { getCurriculumItemById } from "../controllers/curriculumItemController.js";

const router = express.Router();

//course
router.route("/")
    .get(getAllCourses)
    .post(createCourse);
router.route("/:courseId")
    .get(getCourseById)
    .put(updateCourse)
    .delete(deleteCourse);
router.get("/manage", getCourses);
router.get("/info", getCourseInfo)

// section
router.route("/:courseId/sections")
    .get(getAllSectionsByCourse)
    .post(addSectionToCourse);
//.post("/:courseId/sections", addSectionToCourse);
router.route("/:courseId/sections/:sectionId")
    .put(updateSection)
    .delete(deleteSection);


// curriculum
router.route("/:courseId/sections/:sectionId/curriculum")
    .get(getAllCurriculumItemsBySection)

router.route("/:courseId/sections/:sectionId/curriculum/:itemId")
    .put(updateCurriculumItem)
    .delete(deleteCurriculumItem);

router.route("/:courseId/sections/:sectionId/lectures")
    .post(addLectureToSection)

router.route("/:courseId/sections/:sectionId/quizzes")
    .post(addQuizToSection)
// resources
router.delete(
    "/lectures/:lectureId/resources/:resourceId",
    deleteResourceFromLecture
);

// quiz questions
router.route("/quizzes/:quizId/questions/:questionId")
    .put(updateQuestionInQuiz)
    .delete(deleteQuestionFromQuiz);

router.route("/item/:itemId/type/:itemType").get(getCurriculumItemById);

export default router;