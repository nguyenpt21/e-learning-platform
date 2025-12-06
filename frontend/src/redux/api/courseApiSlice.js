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
            invalidatesTags: (result, error, { courseId }) => [{ type: "Course", id: courseId }],
        }),
        getCourseInfo: builder.query({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/info`,
            }),
            providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
        }),
        processCourse: builder.mutation({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/process`,
                method: "POST",
            }),
        }),
        getCaptionStatus: builder.query({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/captions`,
            }),
            providesTags: (result, error, courseId) => [
                { type: "Caption", id: courseId },
                { type: "Course", id: courseId },
            ],
        }),
        addCaption: builder.mutation({
            query: ({ courseId, caption }) => ({
                url: `${COURSE_URL}/${courseId}/captions`,
                method: "POST",
                body: caption,
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: "Caption", id: courseId }],
        }),
        searchCourses: builder.query({
            query: (keyword) => ({
                url: `${COURSE_URL}/search`,
                method: "GET",
                params: { keyword },
            }),
        }),
        getInstructorCourses: builder.query({
            query: () => ({
                url: `${COURSE_URL}/instructor`,
            }),
        }),
        generateCaptions: builder.mutation({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/generate-captions`,
                method: "POST",
            }),
        }),
        deleteCaption: builder.mutation({
            query: ({ courseId, ...data }) => ({
                url: `${COURSE_URL}/${courseId}/captions`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: "Caption", id: courseId }],
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useGetCourseInfoQuery,
    useProcessCourseMutation,
    useGetCaptionStatusQuery,
    useAddCaptionMutation,
    useSearchCoursesQuery,
    useGetInstructorCoursesQuery,
    useGenerateCaptionsMutation,
    useDeleteCaptionMutation
} = courseApiSlice;
