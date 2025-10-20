import { PAYMENT_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPaypalOrder: builder.mutation({
            query: (body) => ({
              url: `${PAYMENT_URL}/paypal/create-order`,
              method: "POST",
              body,
            }),
          }),
        completePaypalOrder: builder.mutation({
            query: (body) => ({
              url: `${PAYMENT_URL}/paypal/complete-order`,
              method: "POST",
              body,
            }),
          }),
    }),
});

export const {
useCreatePaypalOrderMutation,
useCompletePaypalOrderMutation,
} = paymentApiSlice