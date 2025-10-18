import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Student/HomePage";
import CourseDetail from "../pages/Student/CourseDetail";
import { CoursesCatalog } from "@/pages/Student/CourseCatalog";
import Layout from "@/components/student/Layout";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route
                element={
                    <Layout/>
                }
            >
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesCatalog />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/course/:_id" element={<CourseDetail />} />
        </Routes>
    );
};

export default PublicRoutes;
