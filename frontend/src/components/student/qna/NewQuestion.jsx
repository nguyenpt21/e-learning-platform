import Button from "@/components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import MyRichTextEditor from "./MyRTE";

const NewQuestion = ({ handleQuestionClick, getBack, setFetchLoading }) => {
  const handleSubmit = async () => {
    if(title.length === 0 || content.length===0){
        alert("Vui lòng nhập đầy đủ thông tin.")
        return
    }
    setFetchLoading(true);
    // gọi API tạo câu hỏi
    const res = {
      // kết quả trả về của 201 Created
    };
    console.log("Type: ", type,"\nTitle: ", title, "\nContent:\n", content)
    handleQuestionClick(res);
  };

  const handleCancel = () => {
    if (title.length !== 0 || content.length !== 0) {
      const confirmCancel = confirm(
        "Tiến độ của bạn sẽ bị hủy bỏ. Bạn có chắc chắn muốn hủy?"
      );
      if (!confirmCancel) return;
    }
  
    getBack();
  };
  const types = [
    "Bài học lý thuyết",
    "Bài học thử thách",
    "Chủ đề ngoài khóa học",
    "Các loại bài tập khác",
  ];
  const [type, setType] = useState(types[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("")    // code HTML
  return (
    <div className="flex w-full flex-col px-4 space-y-2">
      <p className=" text-lg font-semibold">Đặt câu hỏi mới</p>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => {
            return <SelectItem key={t} value={t}>{t}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-4 py-2 w-full border border-1 border-gray-200 focus:border-[#098be4] rounded"
        placeholder="Nhập tiêu đề cuộc thảo luận..."
      />
        <MyRichTextEditor value={content} onChange={setContent} />
      <div className="flex self-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button variant="reverse" onClick={handleSubmit}>
          Đăng câu hỏi
        </Button>
      </div>
    </div>
  );
};

export default NewQuestion;
