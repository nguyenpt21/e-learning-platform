import React, { useState } from "react";
import MyRichTextEditor from "./MyRTE";
import Button from "@/components/Button";
import { useSelector } from "react-redux";

function WriteReply({ commentId , target, onCancel }) {
  const [content, setContent] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = () => {
    if (content.trim() === "") return;
    console.log("Phản hồi:", content);
    // TODO: gọi API gửi phản hồi ở đây
    setContent("");
    onCancel()
  };

  return (
    <div className="flex items-start gap-2 rounded-lg my-4">
      {/* Ảnh đại diện người dùng */}
      <img
        src={userInfo?.profilePicture?.url !== "" ? userInfo?.profilePicture?.url : null}
        alt="User's avatar"
        className="w-8 h-8 rounded-full border-1 border-[#098be4] rounded-full"
      />

      <div className="w-full flex items-center">
        {/* Khi chưa focus → input đơn */}
        
          <div className="w-full">
            <MyRichTextEditor
              value={content}
              onChange={setContent}
              className="w-full h-[200px] text-gray-200"
              placeholder="Nhập nội dung phản hồi của bạn"
              mention={target}
            />
            <div className="flex space-x-2 justify-end mt-2">
              <Button onClick={onCancel} variant="outline">
                Hủy
              </Button>
              <Button onClick={handleSubmit} variant="reverse">
                Phản hồi
              </Button>
            </div>
          </div>
  
      </div>
    </div>
  );
}

export default WriteReply;
