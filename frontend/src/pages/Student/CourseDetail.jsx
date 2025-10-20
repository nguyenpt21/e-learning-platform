import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { useGetCourseByIdQuery } from '../../redux/api/coursePublicApiSlice';
import { Spinner } from "@/components/ui/spinner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom";
import { ClockAlert } from 'lucide-react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaRegClock } from "react-icons/fa";
import { TbChartBarPopular, TbWorld, TbCategory } from "react-icons/tb";
import { IoDocumentTextOutline, IoCheckmark } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { MdOutlineOndemandVideo } from "react-icons/md";
import { PiPuzzlePieceBold } from "react-icons/pi";
import Footer from "../../components/Footer";

const CourseDetail = () => {
    const param = useParams();
    const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery(param._id);
    const [courseWithDurations, setCourseWithDurations] = useState(null);
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const [showSticky, setShowSticky] = useState(false);
    const [reachedFooter, setReachedFooter] = useState(false);
    const footerRef = useRef(null);

    console.log(course)

    const calculateCourseStats = (courseData) => {
        if (!courseData?.sections) return { courseDuration: 0, totalLectures: 0, totalResources: 0, sections: [] };
        let courseDuration = 0;
        let totalLectures = 0;
        let totalResources = 0;
        const sections = courseData.sections.map(section => {
            let sectionLectures = 0;
            let sectionResources = 0;
            const sectionDuration = section.curriculumItems?.reduce((sum, ci) => {
                if ((ci.type === "video" || ci.type === "article") && ci?.content?.duration) {
                    sectionLectures += 1;
                    sectionResources += ci?.resources?.length || 0;
                    return sum + ci.content.duration;
                }
                return sum;
            }, 0);
            courseDuration += sectionDuration;
            totalLectures += sectionLectures;
            totalResources += sectionResources;
            return {
                sectionId: section._id, sectionDuration, sectionLectures, sectionResources
            };
        });
        return {
            courseDuration, totalLectures, totalResources, sections
        };
    };
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.round((seconds % 3600) / 60);
        let result = '';
        if (hrs > 0) result += `${hrs} giờ`;
        if (mins > 0) result += result ? ` ${mins} phút` : `${mins} phút`;
        return result || '0 phút';
    };
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowStickyHeader(scrollY > 50);
            setShowSticky(scrollY > 250);

            if (footerRef.current) {
                const footerTop = footerRef.current.getBoundingClientRect().top + window.scrollY;
                const reached = scrollY + window.innerHeight >= footerTop;
                setReachedFooter(reached);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        if (course) {
            const updatedCourse = calculateCourseStats(course);
            setCourseWithDurations(updatedCourse);
        }
    }, [course]);

    if (isCourseLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        );
    }
    return (
        <div className="relative">
            <Header />
            <div
                className={`fixed left-0 w-full transition-all duration-500 
                    ${showStickyHeader ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"} 
                    bg-[#002040]/95 backdrop-blur-sm border-b border-gray-700 z-50`}
            >
                <div className="mx-auto py-2 px-8 text-white">
                    <p className="text-[16px] font-semibold truncate max-w-[60%] mb-2">{course?.title}</p>
                    <div className="flex items-center gap-3">
                        <AverageRating averageRating={course?.averageRating} />
                    </div>
                </div>
            </div>
            <div className="bg-[#e0f3ff] text-black">
                <div className="container mx-auto px-8 py-10">
                    <div className="grid grid-cols-3 gap-14 ">
                        <div className="col-span-2 space-y-4">
                            <CourseBreadcrumb course={course} />
                            <h1 className="text-4xl font-bold leading-tight">
                                {course?.title}
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed">
                                {course?.subtitle}
                            </p>
                            <div className="flex items-center gap-2">
                                <AverageRating averageRating={course?.averageRating} />
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <ClockAlert className="w-4 h-4 text-[#098ce9]" />
                                Lần cập nhật gần đây nhất:{" "}
                                <span className="text-black">
                                    {new Date(course?.updatedAt).toLocaleDateString("vi-VN", {
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div
                                className={`w-1/4 transition-all duration-300 transform lg:right-10 xl:right-28
                                    ${reachedFooter
                                        ? "absolute bottom-96"
                                        : showSticky
                                            ? "fixed top-[12%] z-50"
                                            : "absolute top-30 "
                                    } right-[clamp(0.5rem,4vw,7rem)]`}
                            >
                                <RightCard
                                    course={course}
                                    courseWithDurations={courseWithDurations}
                                    formatDuration={formatDuration}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto p-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-10 p-6 border border-[#cee1ef] rounded-sm">
                        {course?.learningOutcomes && course.learningOutcomes.length > 0 && (
                            <div className="">
                                <p className="text-2xl font-semibold mb-5">Bạn sẽ học được</p>
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-4 text-gray-700 text-sm">
                                    {course.learningOutcomes.map((outcome, index) => (
                                        <li key={index}>
                                            <IoCheckmark className="inline text-[#098ce9] mr-2" />
                                            {outcome}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="">
                            <p className="text-2xl font-semibold mb-5">Nội dung khoá học</p>
                            <CourseContent course={course} courseWithDurations={courseWithDurations} formatDuration={formatDuration} />
                        </div>
                        {course?.requirements && course.requirements.length > 0 && (
                            <div className="">
                                <p className="text-2xl font-semibold mb-5">Yêu cầu</p>
                                <ul className="list-disc ml-6 text-gray-700 text-sm space-y-3">
                                    {course.requirements.map((requirement, index) => (
                                        <li key={index}>
                                            {requirement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {course?.intendedLearners && course.intendedLearners.length > 0 && (
                            <div className="">
                                <p className="text-2xl font-semibold mb-5">Đối tượng khoá học</p>
                                <ul className="list-disc ml-6 text-gray-700 text-sm space-y-3">
                                    {course.intendedLearners.map((intendedLearner, index) => (
                                        <li key={index}>
                                            {intendedLearner}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {course?.description && (
                            <div>
                                <p className="text-2xl font-semibold mb-5">Mô tả</p>
                                <div
                                    className="text-gray-700 text-sm html-content font-light"
                                    dangerouslySetInnerHTML={{ __html: course.description }}
                                ></div>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1"></div>
                </div>
            </div>
            <div ref={footerRef}>
                <Footer />
            </div>
        </div>
    );
};

const RightCard = ({ course, courseWithDurations, formatDuration }) => {
    return (
        <div className="bg-white rounded-sm shadow-xl text-gray-800 h-[680px]">
            <div className="w-full h-48 overflow-hidden">
                {course?.thumbnail?.url ? (
                    <img
                        src={course?.thumbnail.url || "/logo.png"}
                        alt={course?.title}
                        className="w-full h-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-6 space-y-4">
                <p className="text-2xl font-semibold text-gray-900">
                    {course?.price ? `${course.price.toLocaleString()} ₫` : "Miễn phí"}
                </p>
                <button className="w-full bg-[#098ce9] text-white font-semibold py-3 rounded-sm hover:bg-[#0a7ad1] transition duration-200">
                    Thêm vào giỏ hàng
                </button>
                <button className="w-full text-[#098ce9] border-2 border-[#098ce9] hover:bg-sky-50 font-semibold py-3 rounded-sm transition duration-200">
                    Mua ngay
                </button>
                <div className="text-gray-900 text-sm px-3">
                    <div className="flex justify-between items-center my-4 border-b border-dashed border-gray-400 pb-4">
                        <span className="flex items-center gap-1.5">
                            <TbChartBarPopular className="text-[20px]" />
                            Cấp độ:
                        </span>
                        <span className="font-semibold">{course?.level}</span>
                    </div>
                    <div className="flex justify-between items-center my-4 border-b border-dashed border-gray-400 pb-4">
                        <span className="flex items-center gap-1.5">
                            <FaRegClock className="text-[20px]" />
                            Thời lượng:
                        </span>
                        <span className="font-semibold">{formatDuration(courseWithDurations?.courseDuration)}</span>
                    </div>
                    <div className="flex justify-between items-center my-4 border-b border-dashed border-gray-400 pb-4">
                        <span className="flex items-center gap-1.5">
                            <IoDocumentTextOutline className="text-[20px]" />
                            Số bài học:
                        </span>
                        <span className="font-semibold">{courseWithDurations?.totalLectures}</span>
                    </div>
                    <div className="flex justify-between items-center my-4 border-b border-dashed border-gray-400 pb-4">
                        <span className="flex items-center gap-1.5">
                            <TbCategory className="text-[20px]" />
                            Tài nguyên tải xuống:
                        </span>
                        <span className="font-semibold">{courseWithDurations?.totalResources}</span>
                    </div>
                    <div className="flex justify-between items-center my-4 pb-4">
                        <span className="flex items-center gap-1.5">
                            <TbWorld className="text-[20px]" />
                            Ngôn ngữ:
                        </span>
                        <span className="font-semibold">{course?.language}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CourseContent = ({ course, courseWithDurations, formatDuration }) => {
    const [showAllSections, setShowAllSections] = useState(false);
    const [openSections, setOpenSections] = useState(
        course?.sections?.[0]?._id ? [course.sections[0]._id] : []
    );
    const handleToggleAll = () => {
        const allSectionIds = course?.sections?.map(section => section._id) || [];
        if (openSections.length === allSectionIds.length) setOpenSections([]);
        else setOpenSections(allSectionIds);
    };
    const displayedSections = showAllSections ? course?.sections : course?.sections?.slice(0, 10);

    return (
        <div className="">
            <div className="flex items-center justify-between mb-2">
                <p className="pl-1 text-gray-700 text-sm flex items-center">
                    {courseWithDurations?.sections.length} phần<LuDot className="text-xl" />
                    {courseWithDurations?.totalLectures} bài học<LuDot className="text-xl" />
                    {formatDuration(courseWithDurations?.courseDuration)} thời lượng
                </p>
                <button
                    onClick={handleToggleAll}
                    className="font-medium text-[#098ce9] hover:underline duration-300 pr-1"
                >
                    {openSections.length === course?.sections?.length
                        ? "Thu gọn tất cả" : "Mở rộng tất cả"}
                </button>
            </div>
            <Accordion
                type="multiple"
                className="w-full border border-[#cee1ef] rounded-sm"
                value={openSections}
                onValueChange={(vals) => setOpenSections(vals)}
            >
                {displayedSections.map((section) => {
                    const foundSection = courseWithDurations?.sections.find(
                        s => s.sectionId === section._id
                    );
                    return (
                        <AccordionItem key={section._id} value={section._id} className="border-b border-[#cee1ef]">
                            <AccordionTrigger className="text-[16px] px-6 flex items-center bg-[#f4faff] rounded-md rounded-bl-none rounded-br-none">
                                <span className="font-semibold">{section.title}</span>
                                {foundSection && (
                                    <div className="text-gray-500 text-sm flex items-center ml-auto">
                                        {foundSection.sectionLectures} bài giảng
                                        <LuDot className="text-xl" />
                                        {formatDuration(foundSection.sectionDuration)}
                                    </div>
                                )}
                            </AccordionTrigger>
                            <AccordionContent className="px-7 py-3 pb-6">
                                <ul className="space-y-5">
                                    {section.curriculumItems
                                        ?.slice()
                                        .sort((a, b) => a.order - b.order)
                                        .map((ci) => (
                                            <div
                                                className="flex items-center text-gray-600 text-[15px] font-light"
                                                key={ci._id}
                                            >
                                                <li className="flex items-center gap-4">
                                                    {ci.itemType === "Lecture" ? (
                                                        ci?.type === "video" ? (
                                                            <MdOutlineOndemandVideo />
                                                        ) : (
                                                            <IoDocumentTextOutline />
                                                        )
                                                    ) : (
                                                        <PiPuzzlePieceBold />
                                                    )}
                                                    <span>{ci?.title}</span>
                                                </li>
                                                <span className="ml-auto">
                                                    {ci.itemType === "Quiz"
                                                        ? `${ci?.questions?.length || 0} câu hỏi`
                                                        : formatDuration(ci?.content?.duration)}
                                                </span>
                                            </div>
                                        ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            {course?.sections?.length > 10 && (
                <div className="flex justify-center mt-4 border border-[#098ce9] rounded-sm hover:bg-sky-50 py-2">
                    <button
                        onClick={() => setShowAllSections(!showAllSections)}
                        className="text-[#098ce9] text-sm font-medium duration-300"
                    >
                        {showAllSections ? "Thu gọn" : "Xem tất cả"}
                    </button>
                </div>
            )}
        </div>
    );
};

const CourseBreadcrumb = ({ course }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem >
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to={`/category/${course?.category}`}>
                            {course?.category?.name || "Category"}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to={`/subcategory/${course?.subcategory}`}>
                            {course?.subcategory?.name || "Subcategory"}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

const AverageRating = ({ averageRating }) => {
    const r = Number(averageRating) || 0;
    const rounded = Math.round(r * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalfStar = rounded - fullStars === 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className='flex items-center gap-3'>
            <div className="flex items-center text-yellow-500 mb-1" aria-hidden="true">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <FaStar key={`full-${i}`} />
                ))}
                {hasHalfStar && <FaStarHalfAlt key="half" />}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <FaRegStar key={`empty-${i}`} />
                ))}
            </div>
            <p className="text-sm">
                <span className="font-semibold text-yellow-500 text-sm">
                    {r.toFixed(1)}
                </span>{" "}
                /5.0 – {r >= 4 ? "Tuyệt vời" : r >= 3 ? "Tốt" : "Trung bình"}
            </p>
        </div>
    );
};

export default CourseDetail