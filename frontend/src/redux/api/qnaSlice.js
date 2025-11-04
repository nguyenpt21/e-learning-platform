import { QNA_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const questionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createQnA: builder.mutation({
            query: (body) => ({
              url: `${QNA_URL}/createQnA`,
              method: "POST",
              body,
            }),
          }),
        getQnAById: builder.mutation({
            query: (id) => ({
              url: `${QNA_URL}/${id}`,
              method: "GET",
            }),
          }),
        getQnAByPage: builder.mutation({
            query: (page) => ({
              url: `${QNA_URL}?page=${page}`,
              method: "GET",
            }),
          }),
    }),
});

export const {
    useCreateQnAMutation,
    useGetQnAByIdMutation,
    useGetQnAByPageMutation,
} = questionApiSlice