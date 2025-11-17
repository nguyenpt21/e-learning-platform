import mongoose from "mongoose";

const VideoConversionSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        s3Keys: [String],
        totalVideos: Number,
        processedVideos: Number,
    },
    { timestamps: true }
);

const VideoConversion = mongoose.model("VideoConversion", VideoConversionSchema);
export default VideoConversion
