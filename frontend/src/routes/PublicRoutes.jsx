import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Student/HomePage";

const PublicRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<HomePage/>} />
        </Routes>
    );
};

export default PublicRoutes;
