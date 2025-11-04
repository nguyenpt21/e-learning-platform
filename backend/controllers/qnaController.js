import QnA from "../models/qna.js";
import { uploadBase64ImagesInContent } from "./uploadController.js";

export const createQNA = async (req, res) => {
    try {
        const userId  = req.user._id
      const { type, title, content } = req.body;
  
      // Xử lý Base64 → upload lên S3 → thay link
      const processedContent = await uploadBase64ImagesInContent(content);
  
      // Lưu processedContent vào DB
      const newPost = await QnA.create({
        author: userId,
        type,
        title,
        content: processedContent,
      });
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create post" });
    }
  };
  
export const getQnAById = async (req, res) => {
    try {
        const { qnaId } = req.params;
        const qna = await QnA.findById(qnaId).populate('author', 'username avatar').populate('comment.user', 'username avatar').populate('comment.replies.user', 'username avatar');
        if (!qna) {
            return res.status(404).json({ message: "QnA not found" });
        }
        res.status(200).json(qna);
    } catch (error) {
        console.error("Error fetching QnA by ID:", error);
    }
}

export const getQnAByPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 7; // Số câu hỏi mỗi trang
        const totalQuestions = await QnA.countDocuments();
        const totalPages = Math.ceil(totalQuestions / limit);
        const qnas = await QnA.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.status(200).json({
            totalQuestions,
            totalPages,
            data: qnas,
        });
    } catch (error) {
        console.error("Error fetching QnAs by page:", error);
        res.status(500).json({ message: "Failed to fetch QnAs" });
    }
}

