import { Routes, Route, Navigate } from "react-router-dom";

const PublicRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<h1>Public Home Page</h1>} />
        </Routes>
    );
};

export default PublicRoutes;
