import React, { useState } from "react";
import MyRichTextEditor from "./MyRTE";
import Button from "@/components/Button";

function WriteComment({ quesId }) {
  const [isFocused, setIsFocused] = useState(false);
  const [content, setContent] = useState("");
  const [user, setUser] = useState({
    _id: "",
    username: "",
    avatar: "https://avatars.githubusercontent.com/u/165537685?v=4",
  });

  const handleSubmit = () => {
    if (content.trim() === "") return;
    console.log("Bình luận:", content);
    // TODO: gọi API gửi bình luận ở đây
    setContent("");
    setIsFocused(false);
  };

  return (
    <div className="flex items-start gap-2 rounded-lg my-4">
      {/* Ảnh đại diện người dùng */}
      <img
        src={user.avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full border-1 border-[#098be4] rounded-full"
      />

      <div className="w-full flex items-center">
        {/* Khi chưa focus → input đơn */}
        {!isFocused ? (
          <input
            type="text"
            placeholder="Nhập bình luận mới của bạn"
            onFocus={() => setIsFocused(true)}
            className="w-full py-2 rounded-md outline-1 outline-[#eef0f2] px-3"
          />
        ) : (
          <div>
            <MyRichTextEditor
              value={content}
              onChange={setContent}
              className="w-full h-[200px] text-gray-200"
              placeholder="Nhập nội dung bình luận của bạn"
            />
            <div className="flex space-x-2 justify-end mt-2">
              <Button onClick={() => setIsFocused(false)} variant="outline">
                Hủy
              </Button>
              <Button onClick={handleSubmit} variant="reverse">
                Bình luận
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriteComment;
