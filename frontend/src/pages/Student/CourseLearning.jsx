import React, { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import CoursePlayer from '@/components/student/course-learning/CoursePlayer'
import Header from '@/components/student/course-learning/Header'
import { QnASheet } from '@/components/student/qna/QnASheet'
import SectionsAccordion from '@/components/student/course-learning/SectionsAccordion'
import { useGetCourseByIdQuery } from '@/redux/api/coursePublicApiSlice'
import { useGetItemsProgressQuery } from '@/redux/api/progressApiSlice'

const CourseLearning = () => {
    const params = useParams()
    const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery(params._id)
    const { data: itemsProgress, isLoading: isProgressLoading } = useGetItemsProgressQuery(params._id)
    const latestProgress = useMemo(() => {
        if (!course) return null
        if (!itemsProgress || itemsProgress.length === 0) {
            const firstSection = course.sections?.[0]
            const firstItem = firstSection?.curriculumItems?.[0]
            return firstItem ? { itemId: firstItem._id, itemType: firstItem.itemType } : null
        }
        const sorted = [...itemsProgress].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return sorted[0];
    }, [course, itemsProgress])
    const [currentItem, setCurrentItem] = useState(null)
    const [currentSectionId, setCurrentSectionId] = useState(null)
    const [isDone, setIsDone] = useState(false);
    const handleDoneChange = (done) => {
        setIsDone(done);
    };
    useEffect(() => {
        if (latestProgress?.itemId && latestProgress?.itemType) {
            setCurrentItem({ itemId: latestProgress.itemId, itemType: latestProgress.itemType })
        }
    }, [latestProgress])

    // Cập nhật currentSectionId khi currentItem thay đổi
    useEffect(() => {
        if (currentItem && course?.sections) {
            const section = course.sections.find(sec =>
                sec.curriculumItems?.some(item => item._id === currentItem.itemId)
            )
            if (section) {
                setCurrentSectionId(section._id)
            }
        }
    }, [currentItem, course?.sections])

    const handleChangeItem = (itemId, itemType) => {
        setCurrentItem({ itemId, itemType });
        setIsDone(false);
    };

    if (isCourseLoading || isProgressLoading || !currentItem) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                courseTitle={course.title} 
                courseId={course._id} 
                lectureId={currentItem?.itemId}
                sectionId={currentSectionId}
            />
            <div className="flex-grow lg:grid lg:grid-cols-7">
                <div className='fixed bottom-5 left-5 z-50'>
                    <QnASheet />
                </div>
                <div className="lg:col-span-5 h-[calc(100vh-64px)] overflow-auto">
                    <CoursePlayer
                        key={`${currentItem.itemId}-${currentItem.itemType}}`}
                        itemId={currentItem.itemId}
                        itemType={currentItem.itemType}
                        onDoneChange={handleDoneChange}
                    />
                </div>
                <div className="lg:col-span-2 h-[calc(100vh-64px)] overflow-auto border-l">
                    <SectionsAccordion
                        sections={course.sections}
                        handleChangeItem={handleChangeItem}
                        currentItem={currentItem}
                        isDone={isDone}
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseLearning