import mongoose from "mongoose";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";
import Section from "../models/section.js";

const getAllSectionsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("sections.sectionId");
        if (!course) return res.status(404).json({ message: "Course not found" });
        const sortedSections = course.sections
            .sort((a, b) => a.order - b.order)
            .map((sec) => {
                // Nếu populate thành công, sec.sectionId là một object Section
                const sectionData = sec.sectionId?.toObject ? sec.sectionId.toObject() : {};
                return {
                    ...sectionData, // toàn bộ thuộc tính của section
                    order: sec.order, // thêm order tương ứng
                };
            });

        res.status(200).json(sortedSections);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllCurriculumItemsBySection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const sectionInCourse = course.sections.find((se) => se.sectionId.toString() === sectionId);
        if (!sectionInCourse)
            return res.status(404).json({ message: "Section not found in course" });

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        const curriculumItems = await Promise.all(
            section.curriculumItems.map(async (item) => {
                let detailedItem = null;

                if (item.itemType === "Lecture") {
                    detailedItem = await Lecture.findById(item.itemId);
                } else if (item.itemType === "Quiz") {
                    detailedItem = await Quiz.findById(item.itemId);
                }

                if (detailedItem) {
                    return {
                        order: item.order,
                        itemType: item.itemType,
                        itemContent: detailedItem,
                    };
                }
                return null;
            })
        );

        const validItems = curriculumItems.filter((item) => item !== null);

        validItems.sort((a, b) => a.order - b.order);

        res.status(200).json(validItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addSectionToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, objective } = req.body; // description có thể undefined

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const sectionData = { course: courseId, title };
        if (objective) sectionData.objective = objective;

        const newSection = new Section(sectionData);
        await newSection.save();

        const newOrder = course.sections.length + 1;

        course.sections.push({
            sectionId: newSection._id,
            order: newOrder,
        });

        await course.save();

        res.status(201).json({
            ...newSection.toObject(),
            order: newOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { title, order } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.sections.includes(sectionId))
            return res.status(404).json({ message: "Section not found in course" });
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { title, order },
            { new: true }
        );
        if (!updatedSection) return res.status(404).json({ message: "Section not found" });
        res.status(200).json(updatedSection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const sectionIndex = course.sections.indexOf(sectionId);
        if (sectionIndex === -1)
            return res.status(404).json({ message: "Section not found in course" });
        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        // xoá cirriculums
        for (const item of section.curriculumItems) {
            if (item.itemType === "Lecture") {
                await Lecture.findByIdAndDelete(item.itemId);
            } else if (item.itemType === "Quiz") {
                await Quiz.findByIdAndDelete(item.itemId);
            }
        }
        //xoá section
        await Section.findByIdAndDelete(sectionId);
        course.sections.splice(sectionIndex, 1);
        await course.save();
        res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addLectureToSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { title, description, type } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const sectionInCourse = course.sections.find((se) => se.sectionId.toString() === sectionId);
        if (!sectionInCourse)
            return res.status(404).json({ message: "Section not found in course" });

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        const newOrder = section.curriculumItems.length + 1;

        let newLecture;

        if (type === "video") {
            const { s3Key, publicURL, duration, thumbnailS3Key, thumbnailURL, fileName } = req.body;
            newLecture = new Lecture({
                type,
                courseId,
                sectionId,
                title,
                ...(description && { description }),
                content: {
                    s3Key,
                    publicURL,
                    duration,
                    thumbnailS3Key,
                    thumbnailURL,
                    fileName
                },
            });
        } else if (type === "article") {
            const { text, duration } = req.body;
            newLecture = new Lecture({
                type,
                courseId,
                sectionId,
                title,
                ...(description && { description }),
                content: {
                    text,
                    duration,
                },
            });
        }

        await newLecture.save();

        section.curriculumItems.push({
            order: newOrder,
            itemId: newLecture._id,
            itemType: "Lecture",
        });
        await section.save();
        res.status(201).json(newLecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addQuizToSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { title, description } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const sectionInCourse = course.sections.find((se) => se.sectionId.toString() === sectionId);
        if (!sectionInCourse)
            return res.status(404).json({ message: "Section not found in course" });

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        const newOrder = section.curriculumItems.length + 1;
        let newItem;

        newItem = new Quiz({
            courseId,
            sectionId,
            title,
            ...(description && { description }),
        });

        await newItem.save();
        section.curriculumItems.push({
            order: newOrder,
            itemId: newItem._id,
            itemType: "Quiz",
        });
        await section.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateCurriculumItem = async (req, res) => {
    try {
        const { courseId, sectionId, itemId } = req.params;
        const {
            itemType,
            title,
            description,
            order,
            type,
            content,
            resource, // for Lecture
            question, // for Quiz
        } = req.body;

        console.log(req.body);
        // const course = await Course.findById(courseId);
        // if (!course) return res.status(404).json({ message: "Course not found" });

        // const sectionInCourse = course.sections.find((se) => se.sectionId.toString() === sectionId);
        // if (!sectionInCourse)
        //     return res.status(404).json({ message: "Section not found in course" });

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        const curriculumItemIndex = section.curriculumItems.findIndex(
            (ci) => ci.itemId.toString() === itemId
        );
        if (curriculumItemIndex === -1)
            return res.status(404).json({ message: "Curriculum item not found in section" });

        if (order !== undefined) {
            section.curriculumItems[curriculumItemIndex].order = order;
            await section.save();
        }

        let item;
        if (itemType === "Lecture") {
            item = await Lecture.findById(itemId);
            item.title = title || item.title;
            item.description = description || item.description;
            // item.order = order !== undefined ? order : item.order;
            item.type = type || item.type;
            item.content = content || item.content;
            if (resource) {
                item.resources.push(resource);
            }
            await item.save();
        } else if (itemType === "Quiz") {
            item = await Quiz.findById(itemId);
            item.title = title || item.title;
            item.description = description || item.description;
            // item.order = order !== undefined ? order : item.order;
            if (question) {
                item.questions.push(question);
            }
            await item.save();
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteCurriculumItem = async (req, res) => {
    try {
        const { courseId, sectionId, itemId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.sections.includes(sectionId))
            return res.status(404).json({ message: "Section not found in course" });
        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        const curriculumItem = section.curriculumItems.find(
            (ci) => ci.itemId.toString() === itemId
        );
        if (!curriculumItem) return res.status(404).json({ message: "Curriculum item not found" });
        if (curriculumItem.itemType === "Lecture") {
            await Lecture.findByIdAndDelete(itemId);
        } else if (curriculumItem.itemType === "Quiz") {
            await Quiz.findByIdAndDelete(itemId);
        }
        section.curriculumItems = section.curriculumItems.filter(
            (ci) => ci.itemId.toString() !== itemId.toString()
        );
        await section.save();
        res.status(200).json({ message: "Curriculum item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteResourceFromLecture = async (req, res) => {
    try {
        const { lectureId, resourceIndex } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });
        lecture.resources.splice(resourceIndex, 1);
        await lecture.save();
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateQuestionInQuiz = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const { questionText, options } = req.body;
        console.log(req.body);

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            console.log("not found quiz");
            return res.status(404).json({ message: "Quiz not found" });
        }

        const question = quiz.questions.id(questionId);
        if (!question) {
            console.log("not found question");
            return res.status(404).json({ message: "Question not found" });
        }

        if (questionText !== undefined) question.questionText = questionText;
        if (options !== undefined) question.options = options;

        await quiz.save();

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteQuestionFromQuiz = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const question = quiz.questions.id(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        question.deleteOne();

        await quiz.save();

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
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
};
