import CourseLearning from "@/pages/Student/CourseLearning";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import { Routes, Route, Navigate } from "react-router-dom";

const StudentRoutes = () => {

    return (
        <Routes>
            <Route
                element={<ProtectedRoutes allowedRoles={["user"]} />}
            >
                <Route path="/learning/:_id" element={<CourseLearning/>} />
            </Route>
        </Routes>
    );
};

export default StudentRoutes;
