import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InstructorRoutes from "./routes/InstructorRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useDispatch, useSelector } from "react-redux";

function App() {
    const { userInfo } = useSelector((state) => state.auth)
    console.log("User in app: ", userInfo)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PublicRoutes />} />
                    <Route path="/student/*" element={<StudentRoutes />} />
                    <Route path="/instructor/*" element={<InstructorRoutes />} />
                    <Route path="*" element={<PublicRoutes />} />
                </Routes>
            </BrowserRouter> 
        </>
    );
}

export default App;
