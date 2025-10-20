import Progress from "../models/progress.js";
import CourseProgress from "../models/course-progress.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";

export const updateLectureProgress = async (req, res) => {
    try {
        const { userId, courseId, sectionId, itemId, itemType, watchedSeconds } = req.body;
        if (itemType !== "Lecture") {
            return res.status(400).json({ message: "Invalid itemType for lecture progress" });
        }
        const lecture = await Lecture.findById(itemId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        const totalSeconds = lecture.content?.duration || 0;
        const progressPercent = totalSeconds
            ? Math.min((watchedSeconds / totalSeconds) * 100, 100)
            : 100;
        const isCompleted = progressPercent >= 95;

        const progress = await Progress.findOneAndUpdate(
            { userId, courseId, sectionId, itemId },
            {
                $set: {
                    itemType,
                    watchedSeconds,
                    totalSeconds,
                    progressPercent,
                    isCompleted,
                },
            },
            { upsert: true, new: true }
        );
        await updateCourseProgress(userId, courseId);
        res.status(200).json({ message: "Lecture progress updated", progress });
    } catch (error) {
        console.log("Error updating lecture progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateQuizProgress = async (req, res) => {
    try {
        const { userId, courseId, sectionId, itemId, itemType, submissionId } = req.body;
        if (itemType !== "Quiz") {
            return res.status(400).json({ message: "Invalid itemType for quiz progress" });
        }
        const quiz = await Quiz.findById(itemId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const progress = await Progress.findOneAndUpdate(
            { userId, courseId, sectionId, itemId },
            {
                $set: {
                    itemType,
                    submissionId,
                    isCompleted: true,
                    progressPercent: 100,
                },
            },
            { upsert: true, new: true }
        );
        await updateCourseProgress(userId, courseId);
        res.status(200).json({ message: "Quiz progress updated", progress });
    } catch (error) {
        console.error("Error updating quiz progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};

async function updateCourseProgress(userId, courseId) {
    const totalLectures = await Lecture.countDocuments({ courseId });
    const totalQuizzes = await Quiz.countDocuments({ courseId });
    const totalItems = totalLectures + totalQuizzes;
    const completedItems = await Progress.countDocuments({
        userId,
        courseId,
        isCompleted: true,
    });
    const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    const isCompleted = percentage >= 100;

    await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        {
            $set: {
                totalItems,
                completedItems,
                percentage,
                isCompleted,
            },
        },
        { upsert: true, new: true }
    );
}

export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;
        const courseProgress = await CourseProgress.findOne({ userId, courseId });
        if (!courseProgress)
            return res.status(404).json({ message: "No progress found for this course" });

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
        if (!progressList || progressList.length === 0) {
            return res.status(404).json({ message: "No progress found for this course" });
        }
        res.status(200).json(progressList);
    } catch (error) {
        console.error("Error getting course progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};