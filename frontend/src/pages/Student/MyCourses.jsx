import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useGetMyCoursesProgressQuery } from '@/redux/api/progressApiSlice';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import React from 'react'
import { BsPlayCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
    const { data: myCourses, isLoading: isMyCoursesLoading } = useGetMyCoursesProgressQuery();

    if (isMyCoursesLoading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex space-x-3 px-3 py-2 mb-2">
                        <Skeleton className="h-14 w-20 rounded-md" />

                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <Header />

            <div className='py-8 px-20 bg-[#002040]'>
                <p className='text-4xl font-extrabold text-white'>Khoá học của tôi</p>
            </div>

            <div className='container min-h-[60vh] py-8'>
                {!isMyCoursesLoading && myCourses?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myCourses.map(course => (
                            <CourseCard key={course.courseId._id} course={course} />
                        ))}
                    </div>
                )}

                {!isMyCoursesLoading && (!myCourses || myCourses.length === 0) && (
                    <p className="text-gray-500 text-center">Bạn chưa có khóa học nào.</p>
                )}

            </div>

            <Footer />
        </div>
    )
}


const CourseCard = ({ course }) => {
    const navigate = useNavigate()

    const handleClickCourse = (courseAlias) => {
        navigate(`/student/learning/${courseAlias}`);
    }

    return (
        <div 
            onClick={() => handleClickCourse(course.courseId.alias)}
            className="group bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-transform duration-300 h-full flex flex-col cursor-pointer"
        >
            <div className="relative w-full h-36">
                <img
                    src={course.courseId.thumbnail.publicURL || "/logo.png"}
                    alt={course.courseId.title}
                    className="w-full h-full object-cover rounded-t-lg"
                />

                <div className="
                    absolute inset-0 flex items-center justify-center
                    bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-500 rounded-t-lg"
                >
                    <div className="rounded-full flex items-center justify-center"
                    >
                        <BsPlayCircleFill className="text-white text-5xl" />
                    </div>
                </div>
            </div>

            <div className="w-full px-4 py-3">
                <div className="text-xl font-semibold">
                    {course.courseId.title}
                </div>

                <Progress value={course.percentage} className="h-2 mt-1" />

                <div className="text-xs text-gray-500 mt-2">
                    {course.percentage}% hoàn thành
                </div>
            </div>
        </div>
    );
};

export default MyCourses