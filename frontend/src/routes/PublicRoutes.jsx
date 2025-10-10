import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Student/HomePage";
import CourseDetail from "../pages/Student/CourseDetail";
import { CoursesCatalog } from "@/pages/Student/CourseCatalog";


const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:_id" element={<CourseDetail/>} />
            <Route path="/courses" element={<CoursesCatalog />} />
         
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default PublicRoutes;
