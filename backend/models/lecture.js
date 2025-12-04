import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["video", "article"] },
    description: { type: String },
    content: {
        s3Key: { type: String },
        publicURL: { type: String },
        hlsURL: { type: String },
        duration: { type: Number }, // duration in seconds
        text: { type: String },
        thumbnailS3Key : { type: String },
        thumbnailURL: { type: String },
        fileName: { type: String },
        captions: [
            {
                s3Key: String,
                publicURL: String,
                language: String,
                isTranslation: Boolean,
                status: { type: String, enum: ["uploaded", "auto-generated", "edited"] },
            },
        ],
    },
    // order: { type: Number, required: true },
    resources: {
        type: [{
            type: { type: String },
            s3Key: { type: String },
            publicURL: { type: String },
            fileName: { type: String },
            urlTitle: { type: String },
            url: { type: String },
        }],
        default: []
    },
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", LectureSchema);
export default Lecture;