import { useGetCourseInfoQuery } from "@/redux/api/courseApiSlice";
import { useParams } from "react-router-dom";
import CourseInfo from "../../pages/instructor/CourseInfo";

const CourseInfoWrapper = () => {
    const { courseId } = useParams();
    const { data: course, isLoading } = useGetCourseInfoQuery(courseId);

    if (isLoading) {
        return <div></div>;
    }
    return <CourseInfo course={course}></CourseInfo>;
};

export default CourseInfoWrapper;
