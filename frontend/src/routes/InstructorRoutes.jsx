import { Routes, Route, Navigate } from "react-router-dom";

import CoursesManage from "../pages/instructor/CoursesManage";
import InstructorLayout from "../components/instructor/InstructorLayout";
import CourseManageLayout from "../components/instructor/CourseManageLayout";
import Curriculum from "../pages/instructor/Curriculum";
import CourseInfoWrapper from "@/components/instructor/CourseInfoWrapper";
import CourseGoalWrapper from "@/components/instructor/CourseGoalWrapper";

const InstructorRoutes = () => {
    return (
        <Routes>
            <Route element={<InstructorLayout />}>
                <Route index element={<Navigate to="/instructor/courses" replace />} />
                <Route path="courses" element={<CoursesManage />} />
            </Route>

            {/* Layout riêng cho quản lý course, không bị bọc bởi InstructorLayout */}
            <Route path="courses/:courseId/manage" element={<CourseManageLayout />}>
                <Route index element={<Navigate to="goal" replace />} />
                <Route path="goal" element={<CourseGoalWrapper />} />
                <Route path="curriculum" element={<Curriculum />}></Route>
                <Route path="basics" element={<CourseInfoWrapper></CourseInfoWrapper>}></Route>
            </Route>
        </Routes>
    );
};

export default InstructorRoutes;
