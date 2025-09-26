// import mongoose from "mongoose";

// const SectionSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     order: { type: Number, required: true },
//     curriculumItems: [{
//         _id: false,
//         itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
//         itemType: { type: String, enum: ["Lecture", "Quiz"], required: true },
//     },],
// });

// const CourseSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     thumbnail: String,
//     subtitle: String,
//     description: String,
//     learningOutcomes: [String],
//     requirements: [String],
//     intendedLearners: [String],
//     instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     category: String,
//     price: { type: Number, default: 0 },
//     language: { type: String, default: "English" },
//     level: { type: String, enum: ["Beginner Level", "Intermediate Level", "Advanced Level", "All Level"], default: "Beginner Level" },
//     sections: [SectionSchema],
// });

// const Course = mongoose.model("Course", CourseSchema);
// export default Course;