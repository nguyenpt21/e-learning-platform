import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/student/HomePage";
import CourseDetail from "../pages/student/CourseDetail";
import { CoursesCatalog } from "@/pages/student/CourseCatalog";
import Layout from "@/components/student/Layout";
import Payment from "@/pages/student/Payment";
import PaypalSuccess from "@/pages/student/PayPalSuccess";
import VerifyEmail from "@/pages/student/VerifyEmail";
import AnnouncementsPage from "@/pages/student/AnnouncementsPage";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route
                element={
                    <Layout />
                }
            >
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/course/:_id/payment" element={<Payment />} />
            </Route>
            <Route path="/courses" element={<CoursesCatalog />} />
            <Route path="/course/:_id" element={<CourseDetail />} />
            <Route path="/course/:_id/paypal-success" element={<PaypalSuccess />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
        </Routes>
    );
};

export default PublicRoutes;
