import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCirclePlay } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
const Lecture = ({ item }) => {
    const [showContentType, setShowContentType] = useState(false);
    const [contentType, setContentType] = useState(item.type || null);
    const [isAddingContent, setIsAddingContent] = useState(false);
    const handleSelectContent = (type) => {
        setContentType(type);
        setShowContentType(false);
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div
                className={`border border-gray-300 p-3 h-[58px] ${
                    isAddingContent ? "rounded-t" : "rounded"
                } bg-white`}
            >
                <div className="flex justify-between items-center relative">
                    <span>Bài học: {item.title}</span>
                    <button
                        className={`px-3 py-1 border rounded text-purple-600 ${
                            isAddingContent ? "opacity-0" : "opacity-100"
                        }`}
                        onClick={() => {
                            setShowContentType(true);
                            setIsAddingContent(true);
                        }}
                    >
                        + Nội dung
                    </button>
                </div>
            </div>
            {showContentType && (
                <div className="border-l border-r border-b border-gray-300 bg-white p-2 rounded-b">
                    <div className="flex gap-2 items-center justify-between">
                        <span>Chọn loại bài học</span>
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => {
                                setShowContentType(false);
                                setIsAddingContent(false);
                            }}
                        >
                            <IoClose size={20}></IoClose>
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <div
                            className="border border-gray-300 rounded hover:bg-gray-100 flex items-center flex-col"
                            onClick={() => handleSelectContent("video")}
                        >
                            <div className="py-3 px-6">
                                <FaCirclePlay className="h-[30px] w-[30px]" />
                            </div>
                            <div className="text-[12px] bg-gray-200 w-full text-center">Video</div>
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
            {contentType === "video" && isAddingContent && (
                <div className="border-l border-b border-r border-gray-300 rounded-b p-2 bg-white">
                    <div className="flex justify-between items-center border-b pb-2">
                        <div className="flex gap-6">
                            <button className="font-semibold border-b-2 border-primary">
                                Tải lên video
                            </button>
                        </div>
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => {
                                setIsAddingContent(false)
                                setContentType(null)
                            }}
                        >
                            <IoClose size={20}></IoClose>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1 border rounded px-3 py-2 text-gray-500">
                            {file ? file.name : "No file selected"}
                        </div>
                        <label className="px-4 py-2 bg-primary text-white rounded cursor-pointer">
                            Chọn video 
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                hidden
                            />
                        </label>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                        <strong>Chủ thích:</strong> Tất cả các file tối thiểu là 720p và ít hơn 4.0
                        GB.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Lecture;
