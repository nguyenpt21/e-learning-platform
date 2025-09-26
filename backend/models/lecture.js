// import mongoose from "mongoose";

// const LectureSchema = new mongoose.Schema({
//     courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//     sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     title: { type: String, required: true },
//     type: { type: String, enum: ["video", "article"] },
//     description: String,
//     content: {
//         videoUrl: String,
//         duration: Number,
//         text: String,
//     },
//     order: { type: Number, required: true },
//     resources: {
//         fileUrl: String,
//         title: String,
//         url: String,
//     },
// });

// const Lecture = mongoose.model("Lecture", LectureSchema);
// export default Lecture;