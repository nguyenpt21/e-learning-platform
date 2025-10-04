import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Student/Home";
import SignIn from "../pages/Student/SignIn";
import SignUp from "../pages/Student/SignUp";

const PublicRoutes = () => {

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default PublicRoutes;
