import { useState } from "react";

import Section from "../../components/instructor/curriculum/Section";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
const sections = [
    {
        id: "1",
        title: "Giới thiệu",
        order: 1,
    },
];
const Curriculum = () => {
    const [sectionForm, setSectionForm] = useState({
        title: "",
        objective: "",
    });

    const [isAddingSection, setIsAddingSection] = useState(false);

    return (
        <div>
            <div className="fixed w-full h-[50px] top-0 left-0"></div>
            <div>
                <h3 className="text-lg p-5 border-b border-b-grayText/20">Chương trình học</h3>
                <div className="p-5">
                    <div className="flex flex-col gap-4">
                        {" "}
                        {sections.map((section, index) => (
                            <Section index={index} section={section}></Section>
                        ))}
                    </div>
                    <div className="mt-3">
                        {isAddingSection ? (
                            <div className="">
                                <button className="p-1 rounded hover:bg-gray-200 flex items-center justify-center">
                                    <IoClose size={18}/>
                                </button>

                                <div className="p-3 mt-2 bg-white border border-gray-300 rounded space-y-3">
                                    <div className="flex gap-2 items-baseline">
                                        <p className="font-semibold block mb-1">Chương mới:</p>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                placeholder="Nhập tên chương"
                                                autoFocus
                                                onChange={(e) =>
                                                    setSectionForm({
                                                        ...sectionForm,
                                                        title: e.target.value,
                                                    })
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
                                                setIsAddingSection(false);
                                            }}
                                            className="text-black font-medium"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsAddingSection(false);
                                            }}
                                            className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/70"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAddingSection(true)}
                                className="px-3 py-1 mt-4 flex items-center gap-2 border rounded text-primary "
                            >
                                <LuPlus size={16} /> Chương
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Curriculum;
