import Lecture from "../models/lecture.js";

export const conversionComplete = async (req, res) => {
    try {
        const { s3Key, status, hlsURL, error } = req.body;

        console.log("Received webhook:", req.body);

        if (!s3Key || !status) {
            return res.status(400).json({
                error: "s3Key and status are required",
            });
        }

        const video = await Lecture.findOne({ "content.s3Key": s3Key });

        if (!video) {
            console.log(`Video not found for s3Key: ${s3Key}`);
            return res.status(404).json({
                error: "Video not found",
            });
        }

        if (status === "success") {
            await Lecture.findByIdAndUpdate(video._id, { "content.hlsURL": hlsURL },)

            console.log(`Video ${video._id} converted successfully`);
        
            return res.json({
                success: true,
                message: "Video conversion completed",
                videoId: video.id,
                hlsPath: hlsPath,
            });
        } else if (status === "failed") {
            console.log(`Video ${video.id} conversion failed: ${error}`);

            return res.json({
                success: true,
                message: "Video conversion failed",
                videoId: video._id,
                error: error,
            });
        }

        res.status(400).json({ error: "Invalid status value" });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message,
        });
    }
};
