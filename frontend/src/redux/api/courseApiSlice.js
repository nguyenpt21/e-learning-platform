import { COURSE_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: `${COURSE_URL}`,
                method: "POST",
                body: data
            }),
        }),
       
    }),
});

export const {useCreateCourseMutation} = courseApiSlice