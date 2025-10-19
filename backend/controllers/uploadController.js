import aws from "aws-sdk";

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
});

export const generateUploadURL = async (req, res) => {
    try {
        const { type, fileName, fileType } = req.body;
        const Key = `${type}/${Date.now()}-${fileName}`;

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
