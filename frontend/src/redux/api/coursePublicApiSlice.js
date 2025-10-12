import { COURSE_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const coursePublicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseById: builder.query({
            query: (courseId) => `${COURSE_URL}/${courseId}`,
        }),
        getCourseByInstructorId: builder.query({
            query: (instructorId) => `${COURSE_URL}/instructor/${instructorId}`
        })
    }),
});

export const {
    useGetCourseByIdQuery,
    useGetCourseByInstructorIdQuery,
} = coursePublicApiSlice