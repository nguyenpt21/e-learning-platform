import CoursePlayer from '@/components/student/course-learning/CoursePlayer'
import Header from '@/components/student/course-learning/Header'
import { QnASheet } from '@/components/student/qna/QnASheet'
import SectionsAccordion from '@/components/student/course-learning/SectionsAccordion'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseByIdQuery } from '@/redux/api/coursePublicApiSlice'
import { useGetItemsProgressQuery } from '@/redux/api/progressApiSlice'
import React, { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const CourseLearning = () => {
    const params = useParams();
    const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery(params._id)
    const { data: itemsProgress, isLoading: isProgressLoading } = useGetItemsProgressQuery(params._id)

    const latestProgress = useMemo(() => {
        if (!itemsProgress || !itemsProgress.length) return null;
        const sorted = [...itemsProgress].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return sorted[0];
    }, [itemsProgress]);

    const [currentItem, setCurrentItem] = useState(() => latestProgress
        ? { itemId: latestProgress.itemId, itemType: latestProgress.itemType }
        : { itemId: null, itemType: null }
    );

    const handleChangeItem = (itemId, itemType) => {
        setCurrentItem({ itemId, itemType });
    }

    useEffect(() => {
        if (latestProgress) {
            setCurrentItem({ itemId: latestProgress.itemId, itemType: latestProgress.itemType });
        }
    }, [latestProgress]);

    if (isCourseLoading || isProgressLoading || !latestProgress) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        );
    }

    return (
        <div className='max-h-screen'>
            <Header courseTitle={course.title} courseId={course._id} />
            <div className='grid grid-cols-7 h-screen'>
            <div className='fixed bottom-5 left-5 z-50'>
                <QnASheet />
            </div>
                <div className='col-span-5 overflow-auto h-full'>
                    <CoursePlayer itemId={currentItem.itemId} itemType={currentItem.itemType} />
                </div>
                <div className='col-span-2 overflow-auto h-full'>
                    <SectionsAccordion sections={course.sections} handleChangeItem={handleChangeItem} />
                </div>
            </div>
        </div>
    )
}

export default CourseLearning