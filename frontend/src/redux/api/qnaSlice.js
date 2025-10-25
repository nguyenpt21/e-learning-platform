import { QNA_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const questionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestionList: builder.mutation({
            query: (page) => ({
              url: `${QNA_URL}/?page=${page}&limit=7`,
              method: "GET",
              body,
            }),
          }),
    }),
});

export const {
useGetQuestionListMutation,
} = questionApiSlice