import { PROGRESS_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const progressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => `${PROGRESS_URL}/course/${courseId}`,
        })
    }),
});

export const {
    useGetCourseProgressQuery,
} = progressApiSlice