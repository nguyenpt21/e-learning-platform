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
const LectureModal = ({ open, onOpenChange }) => {
    const [showContentType, setShowContentType] = useState(true);
    const [contentType, setContentType] = useState(null);

    const handleSelectContent = (type) => {
        setContentType(type);
        setShowContentType(false);
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const [lectureTitle, setLectureTitle] = useState("");
    const [textArticle, setTextArticle] = useState("");
    const [lectureDescription, setLectureDescription] = useState("");

    const handleCloseLectureModal = (open) => {
        onOpenChange(open);
        if (!open) {
            setLectureTitle("");
            setLectureDescription("");
            setContentType("null")
            setShowContentType(true)
        }
        if (contentType === "article") {
            setTextArticle("")
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleCloseLectureModal} className="overflow-hidden">
            <div className="overflow-hidden">
                <DialogContent className="min-w-[700px] max-h-[550px] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm bài giảng mới</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div>
                            <label className="block">Tiêu đề</label>
                            <input
                                type="text"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                className="w-full border rounded border-gray-300 px-3 py-2 mt-1 text-sm"
                                placeholder="Nhập tên lecture..."
                            />
                        </div>

                        {showContentType && (
                            <div className="">
                                <p className="">Loại bài học</p>
                                <div className="flex items-center justify-center gap-3">
                                    <div
                                        className="border border-gray-300 rounded hover:bg-gray-100 flex items-center flex-col"
                                        onClick={() => handleSelectContent("video")}
                                    >
                                        <div className="py-3 px-6">
                                            <FaCirclePlay className="h-[30px] w-[30px]" />
                                        </div>
                                        <div className="text-[12px] bg-gray-200 w-full text-center">
                                            Video
                                        </div>
                                    </div>

                                    <div
                                        className="border border-gray-300 rounded hover:bg-gray-100 flex items-center flex-col"
                                        onClick={() => handleSelectContent("article")}
                                    >
                                        <div className="py-3 px-6">
                                            <FaRegFileAlt className="h-[30px] w-[30px]" />
                                        </div>
                                        <div className="text-[12px] bg-gray-200 w-full text-center">
                                            Tài liệu
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {contentType === "video" && (
                            <div className="">
                                <p className="">Loại bài học</p>
                                <div className="p-2 rounded border border-gray-300 mt-1">
                                    <div className="flex justify-between items-center border-b pb-2 ">
                                        <div className="flex gap-6">
                                            <button className="border-b-2 border-primary">
                                                Tải lên video
                                            </button>
                                        </div>
                                        <button
                                            className="p-1 hover:bg-gray-200 rounded"
                                            onClick={() => {
                                                setShowContentType(true);
                                                setContentType(null);
                                                setFile(null)
                                            }}
                                        >
                                            <IoClose size={20}></IoClose>
                                        </button>
                                    </div>

                                    <label className="flex items-center gap-4 mt-4 cursor-pointer">
                                        <div className="flex-1 border rounded px-3 py-[6px] text-gray-500">
                                            {file ? file.name : "Chưa có file được chọn"}
                                        </div>
                                        <div className="px-4 py-[6px] bg-primary text-white rounded cursor-pointer">
                                            Chọn video
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                hidden
                                            />
                                        </div>
                                    </label>

                                    <p className="text-xs text-gray-500 mt-2">
                                        <strong>Chủ thích:</strong> Tất cả các file tối thiểu là
                                        720p và ít hơn 4.0 GB.
                                    </p>
                                </div>
                            </div>
                        )}
                        {contentType === "article" && (
                            <div className="">
                                <p className="">Loại bài học</p>
                                <div className="p-2 rounded border border-gray-300 mt-1">
                                    <div className="flex justify-between items-center pb-1">
                                        <span>Nội dung</span>
                                        <button
                                            className="p-1 hover:bg-gray-200 rounded"
                                            onClick={() => {
                                                setShowContentType(true);
                                                setContentType(null);
                                            }}
                                        >
                                            <IoClose size={20}></IoClose>
                                        </button>
                                    </div>
                                    <ArticleEditor
                                        content={textArticle}
                                        setContent={setTextArticle}
                                    ></ArticleEditor>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="">
                                <p>Mô tả bài giảng</p>
                                <div className="rounded-[6px] mt-2 focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                                    <ReactQuillNew
                                        className="article-lecture-editor description-lecture-editor"
                                        theme="snow"
                                        value={lectureDescription}
                                        onChange={setLectureDescription}
                                        modules={{
                                            toolbar: [
                                                ["bold", "italic", "underline"],
                                                [{ list: "ordered" }, { list: "bullet" }],
                                            ],
                                        }}
                                        placeholder="Nhập mô tả bài giảng..."
                                    ></ReactQuillNew>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <button
                            onClick={() => handleCloseLectureModal(false)}
                            className="hover:bg-gray-300 px-2 py-1 rounded"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => handleCloseLectureModal(false)}
                            className="bg-primary px-2 py-1 rounded text-white"
                        >
                            Lưu lecture
                        </button>
                    </DialogFooter>
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default LectureModal;
