import { S3Client, DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Khởi tạo S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const deleteS3File = async (s3Key) => {
    if (!s3Key) return;

    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
        };
        
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
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
        
        const command = new DeleteObjectsCommand(params);
        await s3Client.send(command);
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

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key,
            ContentType: fileType,
        });

        const uploadURL = await getSignedUrl(s3Client, command, {
            expiresIn: 600, // 10 minutes
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

/**
 * Upload base64 images inside HTML content to S3 and replace src with S3 URLs
 * @param {string} htmlContent - the HTML string from TipTap
 * @returns {Promise<string>} processed HTML with replaced image URLs
 */

const uploadBase64ImagesInContent = async (htmlContent) => {
  if (!htmlContent) return htmlContent;

  const regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g;
  let match;
  let updatedContent = htmlContent;
  const uploads = [];

  while ((match = regex.exec(htmlContent)) !== null) {
    // ✅ Copy dữ liệu để tránh bị ghi đè
    const fullTag = match[0];
    const mimeType = match[1];
    const base64Data = match[2];

    const buffer = Buffer.from(base64Data, "base64");
    const extension = mimeType.split("/")[1];
    const fileKey = `editor/${Date.now()}-${uuidv4()}.${extension}`;

    uploads.push(
      s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: buffer,
          ContentEncoding: "base64",
          ContentType: `image/${extension}`,
        })
        .promise()
        .then((res) => ({
          original: fullTag, // ✅ dùng bản copy an toàn
          url: res.Location,
        }))
    );
  }

  const results = await Promise.all(uploads);

  results.forEach(({ original, url }) => {
    const newImgTag = original.replace(/src="[^"]+"/, `src="${url}"`);
    updatedContent = updatedContent.replace(original, newImgTag);
  });

  return updatedContent;
};


export { deleteMultipleS3Files, generateUploadURL, deleteFileFromS3, uploadBase64ImagesInContent };
