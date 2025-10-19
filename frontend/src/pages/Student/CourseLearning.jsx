import Header from '@/components/student/course-learning/Header'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseByIdQuery } from '@/redux/api/coursePublicApiSlice'
import React from 'react'
import { useParams } from 'react-router-dom'

const CourseLearning = () => {
    const params = useParams();
    const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery(params._id)
    if (isCourseLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        );
    }
    console.log(course)
    return (
        <div>
            <Header courseTitle={course.title} courseId={course._id} />
        </div>
    )
}

export default CourseLearning