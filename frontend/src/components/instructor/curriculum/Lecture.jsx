import { useState, useRef } from "react";
import { FaRegTrashAlt, FaRegFileAlt } from "react-icons/fa";
import { LuPlus, LuPencil } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDragIndicator } from "react-icons/md";
import { MdOutlineArticle } from "react-icons/md";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";
import LectureResources from "./LectureResources";
import { useGenerateUploadUrlMutation, useUpdateCurriculumItemMutation } from "@/redux/api/sectionApiSlice";
import ArticleEditor from "./ArticleEditor";
import { IoClose } from "react-icons/io5";
import { estimateReadingTime } from "@/utils";

function formatTimeShort(seconds) {
    seconds = Math.max(0, Math.floor(seconds));

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const mm = String(minutes).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");

    return hours > 0 ? `${String(hours).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

const Lecture = ({ item, sectionOrder, lectureOrder, sectionId, courseId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [lectureTitle, setLectureTitle] = useState(item.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(false);
    const [lectureDescription, setLectureDescription] = useState(item.description || "");
    const [isAddingLectureDescription, setIsAddingLectureDescription] = useState(false);
    const [isAddingResource, setIsAddingResource] = useState(false);

    const [isEditingArticleLecture, setIsEditingArticleLecture] = useState(false);
    const [textArticle, setTextArticle] = useState(item.content?.text);

    const [isEditingVideoLecture, setIsEditingVideoLecture] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            setVideoDuration(video.duration);
            window.URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(selectedFile);
    };

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const controllerRef = useRef(null);

    const [generateUploadURL] = useGenerateUploadUrlMutation();

    const [updateLecture] = useUpdateCurriculumItemMutation();
    return (
        <div>
            {isUploading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-[9999]">
                    <div className="flex flex-col items-center justify-center -translate-y-[50%]">
                        <div className="text-white mb-2">Đang tải video lên...</div>
                        <div className="flex items-center gap-3">
                            <div className="w-[500px] bg-gray-300 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelUpload();
                                }}
                                className="text-gray-300 cursor-pointer p-1 pointer-events-auto"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                        <span>
                            Bài học {sectionOrder}.{lectureOrder}: {lectureTitle}
                        </span>
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
                                    updateLecture({
                                        courseId,
                                        sectionId,
                                        itemId: item._id,
                                        data: {
                                            itemType: "Lecture",
                                            title: lectureTitle,
                                        },
                                    });
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
                    {item.content && item.type === "video" && (
                        <div className="flex gap-2">
                            <img
                                src={item.content.thumbnailURL}
                                className="w-[120px] object-cover border-[1.5px] border-gray-300 "
                            ></img>
                            <div className="flex flex-col gap-[1px] cursor-pointer">
                                <p>{item.content.fileName}</p>
                                <span>{formatTimeShort(item.content.duration)}</span>
                                <div className="flex items-center text-primary gap-1">
                                    <button className="p-">
                                        <LuPencil size={15} className="" />
                                    </button>
                                    <span>Sửa nội dung</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {item.content && item.type === "article" && (
                        <div className="flex gap-2">
                            <div className="bg-gray-900 w-[120px] h-[60px] flex justify-center overflow-hidden">
                                <MdOutlineArticle className="w-[80px] h-[80px] text-white text-sm"></MdOutlineArticle>
                            </div>
                            <div className="flex flex-col gap-[1px] cursor-pointer">
                                <span>{formatTimeShort(item.content.duration)}</span>
                                <div
                                    onClick={() => {
                                        setIsEditingArticleLecture(true);
                                        setIsCourseInfoOpen(!isCourseInfoOpen);
                                    }}
                                    className="flex items-center text-primary gap-1"
                                >
                                    <button className="p-">
                                        <LuPencil size={15} className="" />
                                    </button>
                                    <span>Sửa nội dung</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                                        updateLecture({
                                            courseId,
                                            sectionId,
                                            itemId: item._id,
                                            data: {
                                                itemType: "Lecture",
                                                description: lectureDescription,
                                            },
                                        });
                                        setIsAddingLectureDescription(false);
                                    }}
                                    className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    ) : item.description && !isAddingLectureDescription ? (
                        <div className="border-t border-b py-1 border-gray-300">
                            <div
                                onClick={() => setIsAddingLectureDescription(true)}
                                className="prose max-w-none border border-transparent hover:border-gray-300 cursor-pointer"
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
            {isEditingArticleLecture && (
                <div className="border-r border-l border-b rounded-b border-gray-300 bg-white p-2">
                    <div className="flex justify-between items-center pb-1">
                        <span>Nội dung</span>
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => {
                                setIsEditingArticleLecture(false);
                                setIsCourseInfoOpen(!isCourseInfoOpen);
                            }}
                        >
                            <IoClose size={20}></IoClose>
                        </button>
                    </div>
                    <ArticleEditor
                        content={textArticle}
                        setContent={setTextArticle}
                    ></ArticleEditor>
                    <div className="flex justify-end gap-3 mt-3">
                        <button
                            onClick={() => {
                                setIsEditingArticleLecture(false);
                            }}
                            className="font-medium hover:bg-gray-200 py-1 px-2 rounded"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => {
                                updateLecture({
                                    courseId,
                                    sectionId,
                                    itemId: item._id,
                                    data: {
                                        itemType: "Lecture",
                                        content: {
                                            text: textArticle,
                                            duration: estimateReadingTime(textArticle),
                                        },
                                    },
                                });
                                setIsEditingArticleLecture(false);
                                setIsCourseInfoOpen(!isCourseInfoOpen);
                            }}
                            className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                        >
                            Lưu
                        </button>
                    </div>
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
