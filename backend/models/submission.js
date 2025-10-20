import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOptionIndex: { type: Number, required: true },
        isTrue: { type: Boolean }
    }],
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", SubmissionSchema);

export default Submission;