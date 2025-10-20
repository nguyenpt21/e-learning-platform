import { COURSE_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const sectionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSectionToCourse: builder.mutation({
            query: ({ courseId, sectionData }) => ({
                url: `${COURSE_URL}/${courseId}/sections`,
                method: "POST",
                body: sectionData,
            }),
            invalidatesTags: ["Section"],
        }),
        getAllSectionsByCourse: builder.query({
            query: (courseId) => ({
                url: `${COURSE_URL}/${courseId}/sections`,
            }),
            providesTags: ["Section"],
        }),
        generateUploadUrl: builder.mutation({
            query: (body) => ({
                url: "/api/generateUploadURL",
                method: "POST",
                body,
            }),
        }),
        deleteFileFromS3: builder.mutation({
            query: (body) => ({
                url: "/api/deleteFile",
                method: "DELETE",
                body,
            }),
        }),
        getAllCurriculumItemsBySection: builder.query({
            query: ({ courseId, sectionId }) => ({
                url: `${COURSE_URL}/${courseId}/sections/${sectionId}/curriculum`,
            }),

            providesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
        addLectureToSection: builder.mutation({
            query: ({ courseId, sectionId, lectureData }) => ({
                url: `${COURSE_URL}/${courseId}/sections/${sectionId}/lectures`,
                method: "POST",
                body: lectureData,
            }),
            invalidatesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
        addQuizToSection: builder.mutation({
            query: ({ courseId, sectionId, quizData }) => ({
                url: `${COURSE_URL}/${courseId}/sections/${sectionId}/quizzes`,
                method: "POST",
                body: quizData,
            }),
            invalidatesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
        updateCurriculumItem: builder.mutation({
            query: ({ courseId, sectionId, itemId, data }) => ({
                url: `${COURSE_URL}/${courseId}/sections/${sectionId}/curriculum/${itemId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
        updateQuestionInQuiz: builder.mutation({
            query: ({ sectionId, quizId, questionId, data }) => ({
                url: `${COURSE_URL}/quizzes/${quizId}/questions/${questionId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
        deleteQuestionFromQuiz: builder.mutation({
            query: ({ sectionId, quizId, questionId }) => ({
                url: `${COURSE_URL}/quizzes/${quizId}/questions/${questionId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { sectionId }) => [
                { type: "CurriculumItem", id: sectionId },
            ],
        }),
    }),
});

export const {
    useAddSectionToCourseMutation,
    useGetAllSectionsByCourseQuery,
    useDeleteFileFromS3Mutation,
    useGenerateUploadUrlMutation,
    useAddLectureToSectionMutation,
    useGetAllCurriculumItemsBySectionQuery,
    useAddQuizToSectionMutation,
    useUpdateCurriculumItemMutation,
    useUpdateQuestionInQuizMutation,
    useDeleteQuestionFromQuizMutation
} = sectionApiSlice;
