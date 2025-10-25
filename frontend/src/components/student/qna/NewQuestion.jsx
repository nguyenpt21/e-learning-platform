import Button from "@/components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const NewQuestion = ({ handleQuestionClick, getBack, setFetchLoading }) => {
  const handleSubmit = async () => {
    if(title.length === 0 || editor``)
    setFetchLoading(true);
    // gọi API tạo câu hỏi
    const res = {
      // kết quả trả về của 201 Created
    };
    handleQuestionClick(res);
  };
  const types = [
    "Bài học lý thuyết",
    "Bài học thử thách",
    "Chủ đề ngoài khóa học",
    "Các loại bài tập khác",
  ];
  const [type, setType] = useState(types[0]);
  const [title, setTitle] = useState("");
  return (
    <div className="flex w-full flex-col px-4 space-y-2">
      <p className=" text-lg font-semibold">Đặt câu hỏi mới</p>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => {
            return <SelectItem value={t}>{t}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-4 py-2 w-full border border-1 border-gray-200 focus:border-[#098be4] rounded"
        placeholder="Nhập tiêu đề cuộc thảo luận..."
      />

      <div className="flex self-end space-x-2">
        <Button variant="outline" onClick={getBack}>
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
