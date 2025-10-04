import mongoose from "mongoose";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";
import Section from "../models/section.js";

const addSectionToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, order } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const section = await Section.create({
            course: courseId,
            title,
            order
        });
        course.sections.push(section._id);
        await course.save();
        res.status(201).json(section);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

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
        if (!updatedSection)
            return res.status(404).json({ message: "Section not found" });
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
        if (!course)
            return res.status(404).json({ message: "Course not found" });
        const sectionIndex = course.sections.indexOf(sectionId);
        if (sectionIndex === -1)
            return res.status(404).json({ message: "Section not found in course" });
        const section = await Section.findById(sectionId);
        if (!section)
            return res.status(404).json({ message: "Section not found" });
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

const addCurriculumItemToSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { itemType, title, description, order } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.sections.includes(sectionId))
            return res.status(404).json({ message: "Section not found in course" });
        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        let newItem;
        if (itemType === "Lecture") {
            newItem = new Lecture({
                courseId, sectionId, title, description, order,
            });
        } else if (itemType === "Quiz") {
            newItem = new Quiz({
                courseId, sectionId, title, description, order,
            });
        }
        await newItem.save();
        section.curriculumItems.push({
            itemId: newItem._id,
            itemType
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
            itemType, title, description, order,
            type, content, resource, // for Lecture
            question // for Quiz
        } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.sections.includes(sectionId))
            return res.status(404).json({ message: "Section not found in course" });
        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        let item;
        if (itemType === "Lecture") {
            item = await Lecture.findById(itemId);
            item.title = title || item.title;
            item.description = description || item.description;
            item.order = order !== undefined ? order : item.order;
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
            item.order = order !== undefined ? order : item.order;
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
}

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
            ci => ci.itemId.toString() === itemId
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
}

const updateQuestionInQuiz = async (req, res) => {
    try {
        const { quizId, questionIndex, question } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        quiz.questions[questionIndex] = question;
        await quiz.save();
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteQuestionFromQuiz = async (req, res) => {
    try {
        const { quizId, questionIndex } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        quiz.questions.splice(questionIndex, 1);
        await quiz.save();
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}


export {
    addSectionToCourse,
    updateSection,
    deleteSection,
    addCurriculumItemToSection,
    updateCurriculumItem,
    deleteCurriculumItem,
    deleteResourceFromLecture,
    updateQuestionInQuiz,
    deleteQuestionFromQuiz
};

