import { AUTH_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/signup`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: "POST"
            })
        }),
        getProfile: builder.query({
            query: () => ({
                url: `${AUTH_URL}/check`
            }),
        })
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery
} = authApiSlice