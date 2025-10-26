import Progress from "../models/progress.js";
import CourseProgress from "../models/course-progress.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";
import Course from "../models/course.js"

export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;
        const courseProgress = await updateCourseProgress(userId, courseId);

        res.status(200).json(courseProgress);
    } catch (error) {
        console.error("Error getting course progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllUserItemsProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;
        const progressList = await Progress.find({ userId, courseId });
        res.status(200).json(progressList || []);
    } catch (error) {
        console.error("Error getting course progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getItemProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, sectionId, itemId } = req.params;
        const progress = await Progress.findOne({
            userId, courseId, sectionId, itemId,
        });
        if (!progress) {
            return res.json({
                watchedSeconds: 0,
                totalSeconds: 0,
                progressPercent: 0,
            });
        }
        res.json(progress);
    } catch (error) {
        console.error("Error getting item progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateItemProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;
        const { sectionId, itemId, itemType: type,
            watchedSeconds, totalSeconds, progressPercent
        } = req.body;
        if (!courseId || !sectionId || !itemId || !type) {
            return res.status(400).json({ message: "Missing required fields: courseId, sectionId, itemId, or itemType" });
        }
        if (type === "video") {
            if (watchedSeconds == null || totalSeconds == null || progressPercent == null) {
                return res.status(400).json({ message: "Missing video progress fields: watchedSeconds, totalSeconds, progressPercent" });
            }
        }
        const watched = Number(watchedSeconds) || 0;
        const total = Number(totalSeconds) || 0;
        const percent = Math.min(Number(progressPercent) || 0, 100);

        const filter = { userId, courseId, sectionId, itemId };
        const existingProgress = await Progress.findOne(filter);
        if (existingProgress?.isCompleted) {
            await Progress.updateOne(
                { _id: existingProgress._id },
                { $set: { updatedAt: new Date() } }
            );
            const updated = await Progress.findById(existingProgress._id);
            return res.status(200).json(updated);
        }
        const update = {
            userId, courseId, sectionId, itemId,
            itemType: "Lecture",
            progressPercent: percent,
            isCompleted: percent >= 85,
        };
        if (type === "video") {
            Object.assign(update, {
                watchedSeconds: watched,
                totalSeconds: total,
            });
        }
        const progress = await Progress.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
        });
        await updateCourseProgress(userId, courseId);

        res.status(200).json(progress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update progress failed" });
    }
};

const updateCourseProgress = async (userId, courseId) => {
    try {
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        let totalItems;
        if (!courseProgress) {
            const course = await Course.findById(courseId)
                .populate({
                    path: "sections.sectionId",
                    select: "curriculumItems"
                })
                .lean();
            if (!course) throw new Error("Course not found");
            totalItems = course.sections.reduce((acc, section) => {
                const items = section.sectionId?.curriculumItems || [];
                return acc + items.length;
            }, 0);
        } else {
            totalItems = courseProgress.totalItems;
        }

        const completedItems = await Progress.countDocuments({
            userId, courseId, isCompleted: true,
        });
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
        const updated = await CourseProgress.findOneAndUpdate(
            { userId, courseId },
            {
                userId, courseId,
                totalItems, completedItems, percentage,
                isCompleted: percentage >= 100,
            },
            { upsert: true, new: true }
        );
        return updated;
    } catch (err) {
        console.error("Error updating course progress:", err);
        res.status(500).json({ message: "Server error" });
    }
};