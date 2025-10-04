import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InstructorRoutes from "./routes/InstructorRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import PublicRoutes from "./routes/PublicRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";

function App() {
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
