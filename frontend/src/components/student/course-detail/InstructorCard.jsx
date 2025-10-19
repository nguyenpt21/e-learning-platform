import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useGetCourseByInstructorIdQuery } from '../../../redux/api/coursePublicApiSlice';
import { FaStar, FaPlayCircle } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorCard = ({ instructor }) => {
    const [expanded, setExpanded] = useState(false);
    const { data: courses, isLoading: isCoursesLoading } = useGetCourseByInstructorIdQuery(instructor._id)
    if (isCoursesLoading) {
        return (
            <div className="">
                <p className="text-2xl font-semibold mb-5">Giảng viên</p>
                <div className="flex items-start gap-8 mb-4">
                    <Skeleton className="w-[120px] h-[120px] rounded-full" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-[180px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[220px]" />
                        <Skeleton className="h-4 w-[180px]" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                </div>
            </div>
        );
    }
    return (
        <div className="">
            <p className="text-2xl font-semibold mb-5">Giảng viên</p>
            <div className="flex items-start gap-8 mb-4">
                {instructor?.profilePicture?.url ? (
                    <img
                        src={instructor.profilePicture.url}
                        alt={instructor.firstName}
                        className="w-30 h-30 rounded-full object-cover"
                    />
                ) : (
                    <img
                        src="/logo.png"
                        alt="Default avatar"
                        className="w-30 h-30 rounded-full object-cover"
                    />
                )}
                <div className="">
                    <a
                        href="#"
                        className="block text-[18px] font-semibold text-[#195c9f] underline mb-1"
                    >
                        {instructor.firstName} {instructor.lastName}
                    </a>
                    <p className="text-gray-600 text-[16px] mb-2">
                        {instructor.major}
                    </p>
                    <div className="text-[14px] text-gray-700">
                        <div className="flex items-center gap-4 mb-2">
                            <FaStar className="text-yellow-500" />
                            {courses && courses.length > 0
                                ? (
                                    courses.reduce((sum, c) => sum + (c.averageRating || 0), 0) / courses.length
                                ).toFixed(1)
                                : 0
                            }{" "}
                            xếp hạng giảng viên
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPlayCircle className="text-gray-500" />
                            {courses?.length || 0} khóa học
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-gray-700 text-[15px] leading-relaxed">
                {expanded ? (
                    <div
                        className="text-gray-700 text-[14px] html-content font-light"
                        dangerouslySetInnerHTML={{ __html: instructor.biography }}
                    ></div>
                ) : (
                    <div
                        className="text-gray-800 text-[14px] html-content font-light"
                        dangerouslySetInnerHTML={{ __html: instructor.biography.slice(0, 570) }}
                    ></div>
                )}
            </div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-[#195c9f] text-[14px] font-medium hover:underline flex items-center gap-1"
            >
                {expanded ? "Thu gọn" : "Hiện thêm"}
                <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                    <MdKeyboardArrowDown className="text-[18px]" />
                </span>
            </button>
        </div>
    );
}

export default InstructorCard