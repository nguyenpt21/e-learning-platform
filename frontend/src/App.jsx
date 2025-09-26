import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
