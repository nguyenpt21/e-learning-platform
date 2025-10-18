const items = [
    {
        itemType: "Lecture",
        order: 1,
        itemContent: {
            title: "Giới thiệu",
            description:
                '<p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">1. Xuất trình voucher trên điện thoại cho nhân viên kiểm tra. Điều chỉnh độ sáng nếu cần.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">2. Xuất trình giấy tờ tùy thân bản gốc và hợp lệ để xác minh.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">3. Chỉ chấp nhận voucher hợp lệ. Biên lai hoặc bằng chứng thanh toán không được sử dụng để vào cổng.</span>',
        },
    },
    {
        itemType: "Quiz",
        order: 2,
        itemContent: {
            title: "Ôn tập bài 1",
            description:
                '<p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">1. Xuất trình voucher trên điện thoại cho nhân viên kiểm tra. Điều chỉnh độ sáng nếu cần.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">2. Xuất trình giấy tờ tùy thân bản gốc và hợp lệ để xác minh.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(3, 18, 26);">3. Chỉ chấp nhận voucher hợp lệ. Biên lai hoặc bằng chứng thanh toán không được sử dụng để vào cổng.</span>',
        },
    },
];

import { FaRegFileAlt } from "react-icons/fa";
import { LuPencil, LuPlus } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import Lecture from "./Lecture";
import { IoClose } from "react-icons/io5";
import LectureModal from "./LectureModal";
import QuizModal from "./QuizModal";
import Quiz from "./Quiz";
import { useGetAllCurriculumItemsBySectionQuery } from "@/redux/api/sectionApiSlice";

const Section = ({ section, courseId }) => {
    const [sectionForm, setSectionForm] = useState({
        title: section.title || "",
        objective: section.objective || "",
    });

    const [isHovered, setIsHovered] = useState(false);
    const [mode, setMode] = useState("view");

    const [isOpenItemType, setIsOpenItemType] = useState(false);

    const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const { data: curriculumItems, isLoading } = useGetAllCurriculumItemsBySectionQuery({
        courseId,
        sectionId: section._id,
    });

    if (isLoading) {
        return <></>;
    }

    return (
        <div className="border rounded-md bg-primary/2 px-2 pb-4 border-gray-200 ">
            {mode === "view" && (
                <div
                    className="flex py-5 items-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex gap-4 items-center">
                        <h3 className="font-semibold">Chương {section.order}:</h3>
                        <div className="flex items-center gap-2">
                            <FaRegFileAlt size={14}></FaRegFileAlt>
                            {sectionForm.title}
                        </div>
                    </div>
                    <div
                        className={`ml-2 flex items-center gap-1 transition-opacity duration-200 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => {
                                setMode("edit");
                                setIsHovered(false);
                            }}
                        >
                            <LuPencil size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                            <FaRegTrashAlt size={16} className="text-gray-600" />
                        </button>
                    </div>
                    <MdOutlineDragIndicator
                        size={18}
                        className={`${
                            isHovered ? "opacity-100" : "opacity-0"
                        } ml-auto text-gray-600`}
                    />
                </div>
            )}

            {mode === "edit" && (
                <div className="p-3 mt-2 bg-white border border-gray-300 rounded space-y-3">
                    <div className="flex gap-2 items-baseline">
                        <p className="font-semibold block mb-1">Chương {section.order}:</p>
                        <div className="flex-1 space-y-3">
                            <input
                                placeholder="Nhập tên chương"
                                autoFocus
                                onChange={(e) =>
                                    setSectionForm({ ...sectionForm, title: e.target.value })
                                }
                                value={sectionForm.title}
                                className="w-full border focus:border-primary border-gray-300 rounded px-2 py-[6px]"
                            />
                            <div>
                                <label className="font-semibold block mb-1 text-[14px]">
                                    Học viên có thể làm gì được sau chương này?
                                </label>
                                <input
                                    value={sectionForm.objective}
                                    onChange={(e) =>
                                        setSectionForm({
                                            ...sectionForm,
                                            objective: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập mục tiêu học tập"
                                    className="w-full border border-gray-300 rounded px-2 py-[6px] focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setMode("view");
                            }}
                            className="text-black font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => {
                                setMode("view");
                            }}
                            className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-2 pl-10 pr-3 space-y-4">
                {curriculumItems.map((item, index) => {
                    if (item.itemType === "Lecture") {
                        return <Lecture key={index} item={item.itemContent} sectionOrder={section.order} lectureOrder={item.order} sectionId={section._id} courseId={courseId}></Lecture>;
                    } else {
                        return <Quiz key={index} item={item.itemContent} sectionOrder={section.order} quizOrder={item.order} sectionId={section._id} courseId={courseId}></Quiz>;
                    }
                })}

                {isOpenItemType ? (
                    <div className="flex gap-3 mt-4 text-[14px]">
                        <button
                            onClick={() => setIsOpenItemType(false)}
                            className="text-gray-500 hover:text-black -ml-[30px] mb-4"
                        >
                            <IoClose size={18} />
                        </button>
                        <div className="border border-gray-300 border-dashed px-2 py-1 rounded flex gap-3">
                            <button
                                onClick={() => {
                                    setIsLectureModalOpen(true);
                                    setIsOpenItemType(false);
                                }}
                                className="text-primary hover:bg-primary/10 px-2 py-1 rounded flex items-center gap-1"
                            >
                                <LuPlus size={14} /> Bài giảng
                            </button>

                            <button
                                onClick={() => {
                                    setIsQuizModalOpen(true);
                                    setIsOpenItemType(false);
                                }}
                                className="text-primary hover:bg-primary/10 px-2 py-1 rounded flex items-center gap-1"
                            >
                                <LuPlus size={14} /> Quiz
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpenItemType(true)}
                        className={`px-3 py-1 mt-4 flex items-center gap-2 border rounded text-primary 
                    `}
                    >
                        <LuPlus size={16}></LuPlus>
                        Bài học
                    </button>
                )}
                <div>
                    <LectureModal
                        open={isLectureModalOpen}
                        onOpenChange={setIsLectureModalOpen}
                        sectionId={section._id}
                        courseId={courseId}
                    ></LectureModal>
                    <QuizModal
                        open={isQuizModalOpen}
                        onOpenChange={setIsQuizModalOpen}
                        sectionId={section._id}
                        courseId={courseId}
                    ></QuizModal>
                </div>
            </div>
        </div>
    );
};

export default Section;
