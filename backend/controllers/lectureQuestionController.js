import LectureQuestion from "../models/lecture-question.js";

export const getLectureQuestions = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lectureQuestions = await LectureQuestion.findOne({ lectureId });
        
        if (!lectureQuestions) {
            return res.status(200).json({ questions: [] });
        }
        
        res.status(200).json(lectureQuestions);

    } catch (error) {
        console.error("Error fetching lecture questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addLectureQuestions = async (req, res) => {
    try {
        const { lectureId, question } = req.body;
        const lectureQuestions = await LectureQuestion.findOne({ lectureId });

        if (!lectureQuestions) {
            const newLectureQuestions = new LectureQuestion({
                lectureId,
                questions: [question],
            });
            await newLectureQuestions.save();

            return res.status(201).json(newLectureQuestions);
        } else {
            lectureQuestions.questions.push(question);
            await lectureQuestions.save();
        }

        res.status(200).json(lectureQuestions);

    } catch (error) {
        console.error("Error adding lecture questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateLectureQuestion = async (req, res) => {
    try {
        const { lectureId, questionId, question } = req.body;

        const lectureQuestions = await LectureQuestion.findOne({ lectureId });

        if (!lectureQuestions) {
            return res.status(404).json({ message: "Lecture questions not found" });
        }

        const questionIndex = lectureQuestions.questions.findIndex(q => q._id.toString() === questionId);

        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found" });
        }

        lectureQuestions.questions[questionIndex] = question;
        await lectureQuestions.save();

        res.status(200).json(lectureQuestions);

    } catch (error) {
        console.log("Error updating lecture question:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteLectureQuestion = async (req, res) => {
    try {
        const { lectureId, questionId } = req.params;

        const lectureQuestions = await LectureQuestion.findOne({ lectureId });

        if (!lectureQuestions) {
            return res.status(404).json({ message: "Lecture questions not found" });
        }

        const questionIndex = lectureQuestions.questions.findIndex(q => q._id.toString() === questionId);

        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found" });
        }

        lectureQuestions.questions.splice(questionIndex, 1);
        await lectureQuestions.save();

        res.status(200).json(lectureQuestions);

    } catch (error) {
        console.log("Error deleting lecture question:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}