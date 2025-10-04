const items = [
    {
        itemType: "Lecture",
        order: 1,
        itemContent: {
            title: "Giới thiệu",
        },
    },
];

import { FaRegFileAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import Lecture from "./Lecture";
import { FaCheckCircle } from "react-icons/fa";

const Section = ({ section }) => {
    const [title, setTitle] = useState(section.title);
    const [isHovered, setIsHovered] = useState(false);

    const [mode, setMode] = useState("view");

    return (
        <div className="border rounded-md bg-primary/2 px-2 pb-4 border-gray-200 ">
            {mode === "view" && (
                <div
                    className="flex py-5 items-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex gap-4 items-center">
                        <h3 className="font-semibold">Phần {section.order}:</h3>
                        <div className="flex items-center gap-2">
                            <FaRegFileAlt size={14}></FaRegFileAlt>
                            {section.title}
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
                <div className="p-3 mt-2 bg-white border border-gray-300 rounded-md space-y-3">
                    <div className="flex gap-2 items-baseline">
                        <p className="font-semibold block mb-1">Chương {section.order}:</p>
                        <div className="flex-1 space-y-3">
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="w-full border focus:border-primary border-gray-300 rounded-md px-2 py-1"
                            />
                            <div>
                                <label className="font-semibold block mb-1 text-[14px]">
                                    Học viên có thể làm gì được sau chương này?
                                </label>
                                <input
                                    placeholder="Nhập mục tiêu học tập"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:border-primary"
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
                            className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/70"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-2 pl-10 pr-3">
                {items.map((item, index) => {
                    if (item.itemType === "Lecture") {
                        return (
                            <Lecture item={item.itemContent}></Lecture>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Section;
