// import mongoose from "mongoose";

// const QuestionAnswerSchema = new mongoose.Schema({
//     questionText: { type: String, required: true },
//     options: [
//         {
//             optionText: { type: String, required: true },
//             optionExplanation: String,
//         },
//     ],
//     correctAnswerIndex: { type: Number, required: true },
// }, { _id: true });

// const QuizSchema = new mongoose.Schema({
//     courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//     sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     title: { type: String, required: true },
//     questions: [QuestionAnswerSchema],
//     order: { type: Number, required: true },
//     relatedLecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
// });

// const Quiz = mongoose.model("Quiz", QuizSchema);
// export default Quiz;