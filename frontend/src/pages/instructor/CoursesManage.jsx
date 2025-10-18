import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { useCreateCourseMutation } from "@/redux/api/courseApiSlice";
import { useAddSectionToCourseMutation } from "@/redux/api/sectionApiSlice";
const CoursesManage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("Mới nhất");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [courseName, setCourseName] = useState("");
    const [selectedCourseCategory, setSelectedCourseCategory] = useState("Chọn danh mục");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const courseCategories = [
        "Chọn danh mục",
        "Kinh doanh",
        "Tài chính & Kế toán",
        "IT & Phần mềm",
        "Thiết kế",
        "Marketing",
        "Sức khỏe",
        "Nhiếp ảnh & Video",
        "Âm nhạc",
        "Giáo dục",
    ];

    const sortOptions = ["Mới nhất", "Cũ nhất", "A-Z", "Z-A"];

    const navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
        setModalStep(1);
        setCourseName("");
        setSelectedCourseCategory("Chọn danh mục");
        setIsCategoryDropdownOpen(false);
    };

    const handleContinue = () => {
        if (modalStep === 1 && courseName.trim()) {
            setModalStep(2);
        }
    };

    const handleBack = () => {
        if (modalStep === 2) {
            setModalStep(1);
        }
    };

    const [createCourse, { isLoading: isLoadingCreateCourse }] = useCreateCourseMutation();
    const [createSection, { isLoading: isLoadingCreateSection }] = useAddSectionToCourseMutation();

    const handleCreateCourse = async () => {
        try {
            const courseResponse = await createCourse({
                title: courseName,
                category: selectedCourseCategory,
            }).unwrap();
            const courseId = courseResponse._id;

            const sectionResponse = await createSection({
                courseId,
                sectionData: {
                    title: "Giới thiệu",
                },
            });

            navigate(`/instructor/courses/${courseId}/manage`);
        } catch (error) {
            console.error("Lỗi khi tạo khóa học:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Khóa học</h2>
            <div className=" mt-6">
                <div className="flex justify-between">
                    <div className="flex gap-8">
                        <div className="flex gap-1">
                            <div className="flex w-[280px] border border-gray-300 py-1 pl-3 pr-2 rounded focus-within:border-primary">
                                <input
                                    type="text"
                                    placeholder="Nhập tên khóa học"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded bg-white text-gray-700 text-[14px]"
                                />
                            </div>

                            <button className="flex px-[10px] py-2 rounded bg-primary cursor-pointer">
                                <FiSearch className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex text-[14px] font-semibold items-center gap-2 px-3 h-full border border-gray-300 rounded bg-white hover:bg-gray-50 focus:border-primary"
                            >
                                <span className="text-gray-700">{sortOption}</span>
                                <IoIosArrowDown
                                    className={`w-4 h-4 text-gray-500 transition-transform ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-[180px] bg-white border border-gray-300 rounded shadow-lg z-10">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSortOption(option);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-1 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                                sortOption === option
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        {/* New Course Button */}
                        <DialogTrigger asChild>
                            <button className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary/80">
                                Thêm khóa học
                            </button>
                        </DialogTrigger>
                        {/* Modal */}
                        <DialogContent className="p-0 [&>button]:hidden">
                            <DialogHeader className="p-4 flex-row border-b flex justify-between items-center">
                                <DialogTitle>
                                    {modalStep === 1
                                        ? "Thêm khóa học mới"
                                        : "Chọn danh mục khóa học"}
                                </DialogTitle>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-100 text-grayText p-1 rounded hover:bg-gray-200 transition-colors"
                                >
                                    <IoClose className="w-5 h-5" />
                                </button>
                            </DialogHeader>

                            {/* Modal Content */}
                            <div className="px-4 py-2">
                                {modalStep === 1 ? (
                                    <div>
                                        <label
                                            htmlFor="courseName"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Tên khóa học
                                        </label>
                                        <input
                                            id="courseName"
                                            type="text"
                                            value={courseName}
                                            onChange={(e) => setCourseName(e.target.value)}
                                            placeholder="Nhập tên khóa học..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="min-h-[300px]">
                                        <p className="text-grayText">
                                            Danh mục nào phù hợp nhất với kiến ​​thức bạn sẽ chia
                                            sẻ?
                                        </p>
                                        <div className="relative mt-4">
                                            <button
                                                onClick={() =>
                                                    setIsCategoryDropdownOpen(!isDropdownOpen)
                                                }
                                                className="flex w-full text-[14px] font-semibold items-center gap-2 p-2 h-full border border-gray-300 rounded bg-white hover:bg-gray-50 focus:border-primary"
                                            >
                                                <span className="text-gray-700">
                                                    {selectedCourseCategory}
                                                </span>
                                                <IoIosArrowDown
                                                    className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${
                                                        isCategoryDropdownOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </button>

                                            {isCategoryDropdownOpen && (
                                                <div
                                                    className="absolute top-full left-0 mt-1 right-0 bg-white border border-gray-300 rounded
                                                 shadow-lg z-10 h-[200px] pr-1 overflow-hidden"
                                                >
                                                    <div className="h-full overflow-auto">
                                                        {courseCategories.map((cate) => (
                                                            <button
                                                                key={cate}
                                                                onClick={() => {
                                                                    setSelectedCourseCategory(cate);
                                                                    setIsCategoryDropdownOpen(
                                                                        false
                                                                    );
                                                                }}
                                                                className={`w-full px-4 py-1 text-left hover:bg-gray-50  transition-colors ${
                                                                    selectedCourseCategory === cate
                                                                        ? "bg-primary/10 text-primary"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {cate}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Modal Footer */}
                            <DialogFooter className="p-4 flex-row sm:justify-between">
                                {modalStep === 2 ? (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Trở lại
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setCourseName("");
                                            setIsModalOpen(false);
                                        }}
                                        className="px-4 py-2 cursor-pointer bg-gray-200 p-1 rounded hover:bg-gray-300 text-grayText transition-colors"
                                    >
                                        Hủy
                                    </button>
                                )}
                                {modalStep === 1 ? (
                                    <button
                                        onClick={handleContinue}
                                        disabled={!courseName.trim()}
                                        className="px-4 py-2 bg-primary cursor-pointer hover:bg-primary/80 text-white rounded disabled:bg-primary/80"
                                    >
                                        Tiếp tục
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCreateCourse}
                                        disabled={
                                            selectedCourseCategory === "Chọn danh mục" ||
                                            isLoadingCreateCourse ||
                                            isLoadingCreateSection
                                        }
                                        className="px-4 py-2 cursor-pointer bg-primary hover:bg-primary/80 text-white rounded "
                                    >
                                        Thêm khóa học
                                    </button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CoursesManage;
