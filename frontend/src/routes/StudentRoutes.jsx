import CourseLearning from "@/pages/Student/CourseLearning";
import ProfilePage from "@/pages/student/ProfilePage";
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
            </Route>
        </Routes>
    );
};

export default StudentRoutes;
