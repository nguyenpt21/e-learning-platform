import CourseLearning from "@/pages/Student/CourseLearning";
import MyCourses from "@/pages/Student/MyCourses";
import ProfilePage from "@/pages/student/ProfilePage";
import WishlistPage from "@/pages/student/WishlistPage";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import { Routes, Route, Navigate } from "react-router-dom";

const StudentRoutes = () => {

    return (
        <Routes>
            <Route
                element={<ProtectedRoutes allowedRoles={["user"]} />}
            >
                <Route path="/learning/:courseAlias" element={<CourseLearning/>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-courses" element={ <MyCourses/>} />
                <Route path="/wishlist" element={ <WishlistPage/>} />
            </Route>
        </Routes>
    );
};

export default StudentRoutes;
