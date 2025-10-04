import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Student/HomePage";


const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default PublicRoutes;
