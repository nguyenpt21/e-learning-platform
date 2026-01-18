import React from 'react'
import Header from "../Header"
import Footer from "../Footer"
import { Outlet } from 'react-router-dom';
import MyCoursesLoader from '@/components/student/home-page/MyCourseLoader';
import SEO from '@/components/SEO';

const Layout = () => {
    return (
        <>
            <MyCoursesLoader />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout