import { PROGRESS_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const progressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => `${PROGRESS_URL}/course/${courseId}`,
            providesTags: (result, error, courseId) => [{ type: 'Progress', id: courseId }],
        }),
        getItemsProgress: builder.query({
            query: (courseId) => `${PROGRESS_URL}/course/${courseId}/items`,
        }),
        updateItemProgress: builder.mutation({
            query: ({ courseId, ...data }) => ({
                url: `${PROGRESS_URL}/course/${courseId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, data) => [{ type: 'Progress', id: data.courseId }],
        }),
        getItemProgress: builder.query({
            query: ({ courseId, sectionId, itemId }) =>
                `${PROGRESS_URL}/course/${courseId}/section/${sectionId}/item/${itemId}`,
        }),
    }),
});

export const {
    useGetCourseProgressQuery,
    useGetItemsProgressQuery,
    useUpdateItemProgressMutation,
    useGetItemProgressQuery,
} = progressApiSlice