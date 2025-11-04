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
    getQnAById: builder.query({
      query: (id) => ({
        url: `${QNA_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "QnA", id }],
    }),
    getQnAByPage: builder.query({
      query: (page = 1) => ({
        url: `${QNA_URL}?page=${page}`,
      }),
    }),
    createComment: builder.mutation({
      query: ({ qnaId, body }) => ({
        url: `${QNA_URL}/${qnaId}/comment`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { qnaId }) => [
        { type: "QnA", id: qnaId },
      ],
    }),
    createReply: builder.mutation({
      query: ({ qnaId, commentId, body }) => ({
        url: `${QNA_URL}/${qnaId}/comment/${commentId}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { qnaId }) => [
        { type: "QnA", id: qnaId },
      ],
    }),
    updateReactionComment: builder.mutation({
      query: ({ qnaId, commentId, body }) => ({
        url: `${QNA_URL}/${qnaId}/comment/${commentId}/reaction`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { qnaId }) => [
        { type: "QnA", id: qnaId },
      ],
    }),
    updateReactionReply: builder.mutation({
      query: ({ qnaId, commentId, replyId, body }) => ({
        url: `${QNA_URL}/${qnaId}/comment/${commentId}/reply/${replyId}/reaction`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { qnaId }) => [
        { type: "QnA", id: qnaId },
      ],
    })
  }),
});

export const {
  useCreateQnAMutation,
  useGetQnAByIdQuery,
  useGetQnAByPageQuery,
  useCreateCommentMutation,
  useCreateReplyMutation,
  useUpdateReactionCommentMutation,
  useUpdateReactionReplyMutation
} = questionApiSlice;
