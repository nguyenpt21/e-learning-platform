import express from "express";
import {
    getCourseById,
    getAllCourses,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseInfo,
    processCourse,
    getSearchCourseSuggestion,
    getSearchCourseResults,
    generateCaption,
    getCaptionVideoStatus,
    addCaptionVideo
    getAllCoursesInfo,
    searchCourses,
    getInstructorCourses,
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
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router();

//search
router.route("/suggestion")
    .get(getSearchCourseSuggestion)
router.route("/suggestion/results")
    .get(getSearchCourseResults)
router.route("/getAllCoursesInfo")
    .get(getAllCoursesInfo)
router.route("/search")
    .get(searchCourses)
router.get("/instructor", protectRoute, getInstructorCourses)

//course
router.route("/")
    .get(getAllCourses)
    .post(createCourse);
router.route("/:courseId")
    .get(getCourseById)
    .put(updateCourse)
    .delete(deleteCourse);
router.get("/manage", getCourses);
router.get("/:courseId/info", getCourseInfo)
router.post("/:courseId/process", processCourse)
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

router.post('/:courseId/generate-captions', generateCaption)
router.get('/:courseId/captions', getCaptionVideoStatus)
router.post('/:courseId/captions', addCaptionVideo)

export default router;