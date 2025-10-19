import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/student/HomePage";
import CourseDetail from "../pages/student/CourseDetail";
import { CoursesCatalog } from "@/pages/student/CourseCatalog";
import Layout from "@/components/student/Layout";
import ProfilePage from "@/pages/student/ProfilePage";

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
                   <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/course/:_id" element={<CourseDetail />} />
         
        </Routes>
    );
};

export default PublicRoutes;
