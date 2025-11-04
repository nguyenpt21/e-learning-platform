import mongoose from "mongoose";

const QnASchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: "String", require: true }, // Lý thuyết, Thử thách, ...
    title: { type: "String", required: true },
    content: { type: "String", required: true },
    comment: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: "String", required: true },
        likes: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            type: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"] },
        }],
        replies: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            content: { type: "String", required: true },
            likes: [{
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                type: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"] },
            }],
          },
        ],
        isSolution: { type: Boolean, default: false },
      },
    ],
    isSolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const QnA = mongoose.model("QnA", QnASchema);
export default QnA;
