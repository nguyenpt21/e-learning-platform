import { Spinner } from "@/components/ui/spinner";
import { CircleCheck, CircleQuestionMark } from "lucide-react";
import React, { useEffect, useState } from "react";
import WriteComment from "./WriteComment";
import CommentList from "./CommentList";

function QuestionDetail({ quesId }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exContent, setExContent] = useState("");

  // Dùng tạm content mẫu (lưu trong thư mục public)
  useEffect(() => {
    fetch("/ContentExample.txt")
      .then((res) => res.text())
      .then((text) => setExContent(text))
      .catch((err) => console.error("Error loading content:", err));
  }, []);

  // Gọi fetchDetail sau khi exContent đã có
  useEffect(() => {
    if (!exContent) return; // tránh gọi khi chưa load xong txt

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              _id: "1421",
              type: "Bài học lý thuyết",
              author: {
                _id: "666",
                username: "HacThienCau",
                avatar: "https://avatars.githubusercontent.com/u/165537685?v=4",
              },
              createdAt: Date.now(),
              title: "Cách tạo Rich Text Editor (RTE) với React và TipTap",
              content: exContent, // gán nội dung txt vào đây
              likes: [{ userId: "2806", type: "Love" }],
              comment: [
                {
                  user: {
                    _id: "2806",
                    username: "UyenNe",
                    avatar:
                      "https://th.bing.com/th/id/OIP.75e48zcpbQtRaf6yu9BadgHaIu?pid=ImgDetMain",
                  },
                  content: "",
                  createdAt: "",
                  replies: [],
                  isSolution: true,
                },
              ],
              isSolved: true,
            });
          }, 1000);
        });
        setDetail(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [quesId, exContent]);

  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const intervals = [
      { label: "năm", seconds: 31536000 },
      { label: "tháng", seconds: 2592000 },
      { label: "ngày", seconds: 86400 },
      { label: "giờ", seconds: 3600 },
      { label: "phút", seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label} trước`;
      }
    }
    return "vừa xong";
  }

  if (loading)
    return (
      <div className="flex h-full items-center justify-center z-50">
        <Spinner className="size-12" color="#098ce9" />
      </div>
    );

  return (
    <div className="flex w-full flex-col px-4 space-y-2 overflow-y-auto mb-10">
      <div className="w-full flex items-center gap-2 p-2">
        <p className="text-lg font-semibold">{detail?.title}</p>
        <div className="text-sm text-white py-1 px-2 rounded bg-[#098be4]">
          {detail?.type}
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-2 p-2">
        <div className="flex space-x-2 items-center">
          <img
            src={detail?.author.avatar}
            className="w-10 h-10 rounded-full border-1 border-[#098be4]"
          />
          <p className="font-semibold">{detail?.author.username}</p>
          <p className="text-sm text-gray-700">{timeAgo(detail?.createdAt)}</p>
        </div>
        {detail?.isSolved ? (
          <div className="flex items-center text-green-500 gap-2 text-sm">
            <CircleCheck />
            Đã trả lời
          </div>
        ) : (
          <div className="flex items-center text-gray-500 gap-2 text-sm">
            <CircleQuestionMark />
            Chưa trả lời
          </div>
        )}
      </div>
      {/* Hiển thị nội dung HTML từ file txt */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: detail?.content }}
      />

      <WriteComment quesId={quesId} />

      <div className="w-full">
        <p className="font-semibold">{detail?.comment.length} bình luận</p>
        <CommentList comments={detail?.comment}/>
      </div>
    </div>
  );
}

export default QuestionDetail;
