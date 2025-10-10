import React from 'react'
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Button } from "@/components/ui/button"

const CourseDetail = () => {
    const param = useParams();
    return (
        <div>
            <Header />
            <h1>Course Detail Page - Course ID: {param._id}</h1>
            <Button variant="outline">Enroll Now</Button>
        </div>
    )
}

export default CourseDetail