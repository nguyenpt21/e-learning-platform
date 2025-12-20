import React from 'react'
import Header from "../Header"
import Footer from "../Footer"
import { Outlet } from 'react-router-dom';
import MyCoursesLoader from '@/components/student/home-page/MyCourseLoader';

const Layout = () => {
    return (
        <div>
            <MyCoursesLoader/>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout