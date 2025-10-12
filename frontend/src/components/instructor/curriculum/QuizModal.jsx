import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCirclePlay } from "react-icons/fa6";
import { FaRegFileAlt, FaRegTrashAlt } from "react-icons/fa";
import ArticleEditor from "./ArticleEditor";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const QuizModal = ({ open, onOpenChange }) => {
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const handleCloseQuizModal = (open) => {
        onOpenChange(open);
        if (!open) {
            setQuizTitle("");
            setQuizDescription("");
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleCloseQuizModal} className="overflow-hidden">
            <div className="overflow-hidden">
                <DialogContent className="min-w-[700px] max-h-[500px] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm bài giảng mới</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div>
                            <label className="block">Tiêu đề</label>
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                className="w-full border rounded border-gray-300 px-3 py-2 mt-1 text-sm"
                                placeholder="Nhập tên quiz..."
                            />
                        </div>
                        <div>
                            <div className="">
                                <p>Mô tả bài giảng</p>
                                <div className="rounded-[6px] mt-2 focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                                    <ReactQuillNew
                                        className="article-lecture-editor description-lecture-editor"
                                        theme="snow"
                                        value={quizDescription}
                                        onChange={setQuizDescription}
                                        modules={{
                                            toolbar: [
                                                ["bold", "italic", "underline"],
                                            ],
                                        }}
                                        placeholder="Nhập mô tả quiz..."
                                    ></ReactQuillNew>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <button
                            onClick={() => handleCloseQuizModal(false)}
                            className="hover:bg-gray-300 px-2 py-1 rounded cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => handleCloseQuizModal(false)}
                            className="bg-primary px-2 py-1 rounded text-white cursor-pointer"
                        >
                            Lưu quiz
                        </button>
                    </DialogFooter>
                </DialogContent>
            </div>
        </Dialog>
    );
};
export default QuizModal;
