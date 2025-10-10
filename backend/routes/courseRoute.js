import express from "express";
import {
    getCourseById,
    getAllCourses,
    getCoursesByInstructor,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/courseController.js";

import {
    getAllSectionsByCourse,
    getAllCurriculumItemsBySection,
    addSectionToCourse,
    updateSection,
    deleteSection,
    addCurriculumItemToSection,
    updateCurriculumItem,
    deleteCurriculumItem,
    deleteResourceFromLecture,
    updateQuestionInQuiz,
    deleteQuestionFromQuiz,
} from "../controllers/sectionController.js";

const router = express.Router();

//course
router.route("/")
    .get(getAllCourses)
    .post(createCourse);
router.route("/:courseId")
    .get(getCourseById)
    .put(updateCourse)
    .delete(deleteCourse);
router.get("/instructor/:instructorId", getCoursesByInstructor);


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
    .post(addCurriculumItemToSection);
router.route("/:courseId/sections/:sectionId/curriculum/:itemId")
    .put(updateCurriculumItem)
    .delete(deleteCurriculumItem);

// resources
router.delete(
    "/lectures/:lectureId/resources/:resourceIndex",
    deleteResourceFromLecture
);

// quiz questions
router.route("/quizzes/:quizId/questions/:questionIndex")
    .put(updateQuestionInQuiz)
    .delete(deleteQuestionFromQuiz);

export default router;