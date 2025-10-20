import { COURSE_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const coursePublicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseById: builder.query({
            query: (courseId) => `${COURSE_URL}/${courseId}`,
        }),
        getCurriculumItemById: builder.query({
            query: ({itemId, itemType}) => `${COURSE_URL}/item/${itemId}/type/${itemType}`
        })
    }),
});

export const {
    useGetCourseByIdQuery,
    useGetCurriculumItemByIdQuery,
} = coursePublicApiSlice