// import mongoose from 'mongoose';

// const ProgressSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//     sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
//     watchedSeconds: { type: Number, default: 0, min: 0 }, // đã xem đến giây thứ bao nhiêu
//     isCompleted: { type: Boolean, default: false },       // đã hoàn thành lecture hay chưa
// });

// const Progress = mongoose.model('Progress', ProgressSchema);
// export default Progress;