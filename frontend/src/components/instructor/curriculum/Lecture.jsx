import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPlus, LuPencil } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDragIndicator } from "react-icons/md";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";
import LectureResources from "./LectureResources";

const Lecture = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [lectureTitle, setLectureTitle] = useState(item.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(false);
    const [lectureDescription, setLectureDescription] = useState(item.description || "");
    const [isAddingLectureDescription, setIsAddingLectureDescription] = useState(false);
    const [isAddingResource, setIsAddingResource] = useState(false);
    return (
        <div>
            <div
                className={`border border-gray-300 p-3 ${
                    isCourseInfoOpen || isAddingResource ? "rounded-t" : "rounded"
                } bg-white`}
            >
                {!isEditingTitle ? (
                    <div
                        className="flex items-center relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span>Bài học: {item.title}</span>
                        <div
                            className={`ml-2 flex items-center gap-1 transition-opacity duration-200 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <button
                                className="p-1 hover:bg-gray-200 rounded"
                                onClick={() => {
                                    setIsEditingTitle(true);
                                    setIsHovered(false);
                                    setIsCourseInfoOpen(false);
                                    setIsAddingLectureDescription(false);
                                }}
                            >
                                <LuPencil size={15} className="" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                                <FaRegTrashAlt size={15} className="" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <div className="flex">
                                <div
                                    onClick={() => setIsCourseInfoOpen(!isCourseInfoOpen)}
                                    className={`p-1 w-6 h-6 hover:bg-gray-200 rounded ${
                                        isAddingResource ? "opacity-0" : "opacity-100"
                                    }`}
                                >
                                    {isCourseInfoOpen ? (
                                        <IoIosArrowUp></IoIosArrowUp>
                                    ) : (
                                        <IoIosArrowDown></IoIosArrowDown>
                                    )}
                                </div>
                                <MdOutlineDragIndicator
                                    className={`p-1 w-6 h-6 hover:bg-gray-200 rounded ${
                                        isHovered ? "opacity-100" : "opacity-0"
                                    }`}
                                ></MdOutlineDragIndicator>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center">
                            <span>Bài giảng: </span>
                            <div className="flex-1 space-y-3 ml-2">
                                <input
                                    autoFocus
                                    onChange={(e) => setLectureTitle(e.target.value)}
                                    value={lectureTitle}
                                    className="w-full border focus:border-primary border-gray-300 rounded px-2 py-[6px]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-3">
                            <button
                                onClick={() => {
                                    setIsEditingTitle(false);
                                }}
                                className="font-medium hover:bg-gray-200 py-1 px-2 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingTitle(false);
                                }}
                                className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isCourseInfoOpen && (
                <div className="border-l border-b border-r border-gray-300 rounded-b p-2 bg-white flex flex-col gap-3">
                    {isAddingLectureDescription ? (
                        <div className="border-b pb-2">
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
                                ></ReactQuillNew>
                            </div>
                            <div className="flex justify-end gap-3 mt-3">
                                <button
                                    onClick={() => {
                                        setIsAddingLectureDescription(false);
                                    }}
                                    className="font-medium hover:bg-gray-200 py-1 px-2 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingLectureDescription(false);
                                    }}
                                    className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    ) : item.description && !isAddingLectureDescription ? (
                        <div className="py-2 border-t border-b border-gray-300">
                            <div
                                onClick={() => setIsAddingLectureDescription(true)}
                                className="prose max-w-none border border-transparent hover:border-gray-300 p-2 cursor-pointer"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(lectureDescription),
                                }}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingLectureDescription(true)}
                            className="border cursor-pointer rounded px-3 py-1 text-primary font-semibold flex items-center gap-2 w-fit"
                        >
                            <LuPlus size={16}></LuPlus> Mô tả
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsAddingResource(true);
                            setIsCourseInfoOpen(false);
                        }}
                        className="border cursor-pointer rounded px-3 py-1 text-primary font-semibold flex items-center gap-2 w-fit"
                    >
                        <LuPlus size={16}></LuPlus> Tài nguyên
                    </button>
                </div>
            )}
            {isAddingResource && (
                <LectureResources
                    handleClose={() => {
                        setIsAddingResource(false);
                        setIsCourseInfoOpen(true);
                    }}
                ></LectureResources>
            )}
        </div>
    );
};

export default Lecture;
