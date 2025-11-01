import { useGetCourseInfoQuery } from "@/redux/api/courseApiSlice";
import { useParams } from "react-router-dom";
import CourseInfo from "../../pages/instructor/CourseInfo";
import CourseGoal from "@/pages/instructor/CourseGoal";

const CourseGoalWrapper = () => {
    const { courseId } = useParams();
    const { data: course, isLoading } = useGetCourseInfoQuery(courseId);

    if (isLoading) {
        return <div></div>;
    }
    return <CourseGoal course={course}></CourseGoal>;
};

export default CourseGoalWrapper;
