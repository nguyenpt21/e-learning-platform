import aws from "aws-sdk";

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
});

const deleteS3File = async (s3Key) => {
    if (!s3Key) return;

    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
        };
        await s3.deleteObject(params).promise();
        console.log(`Deleted S3 file: ${s3Key}`);
    } catch (error) {
        console.error(`Error deleting S3 file ${s3Key}:`, error);
    }
};

const deleteMultipleS3Files = async (s3Keys) => {
    const validKeys = s3Keys.filter((key) => key && key.trim() !== "");
    if (validKeys.length === 0) return;

    try {
        const objects = validKeys.map((key) => ({ Key: key }));
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Delete: { Objects: objects },
        };
        await s3.deleteObjects(params).promise();
        console.log(`Deleted ${validKeys.length} S3 files`);
    } catch (error) {
        console.error("Error deleting multiple S3 files:", error);
    }
};

const generateUploadURL = async (req, res) => {
    try {
        const { courseId, type, fileName, fileType } = req.body;
        let Key;
        Key = `${type}/${Date.now()}-${fileName}`;

        if (courseId) {
            Key = courseId.toString() + "/" + Key;
        }

        const uploadURL = await s3.getSignedUrlPromise("putObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key,
            ContentType: fileType,
            Expires: 600,
        });

        const publicURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

        res.status(200).json({ uploadURL, s3Key: Key, publicURL });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate upload URL" });
    }
};

const deleteFileFromS3 = async (req, res) => {
    try {
        const { s3Key } = req.body;

        await deleteS3File(s3Key);

        res.status(200).json({
            message: "File deleted successfully",
            deletedKey: s3Key,
        });
    } catch (error) {
        console.error("Error deleting file from S3:", error);
        res.status(500).json({
            message: "Failed to delete file from S3",
            error: error.message,
        });
    }
};

export { deleteMultipleS3Files, generateUploadURL, deleteFileFromS3 };
