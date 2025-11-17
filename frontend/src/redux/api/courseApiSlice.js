import { COURSE_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: `${COURSE_URL}`,
                method: "POST",
                body: data,
            }),
        }),
        updateCourse: builder.mutation({
            query: ({ courseId, data }) => ({
                url: `${COURSE_URL}/${courseId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "CurriculumItem", id: courseId },
            ],
        }),
        getCourseInfo: builder.query({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/info`,
            }),
            providesTags: (result, error, courseId) => [{ type: "CurriculumItem", id: courseId }],
        }),
        processCourse: builder.mutation({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/process`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useGetCourseInfoQuery,
    useProcessCourseMutation,
} = courseApiSlice;
