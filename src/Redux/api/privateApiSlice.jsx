import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const privateApiSlice = createApi({
  reducerPath: "privateApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      console.log(token)
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({

    //Payment Gateway Integration
    SendPaymentGateway: builder.mutation({
      query: (data) => ({
        url: "/subscribe-payment",
        method: "POST",
        body: data,
      }),
    }),

    //Payment Logout
    SendPaymentLogout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    //GET Subcription
    sendGetSubscription: builder.mutation({
      query: () => ({
        url: "/user-subscriptions",
        method: "GET",
      }),
    }),

   
  }),
});

export const {
 useSendPaymentGatewayMutation,
 useSendPaymentLogoutMutation,
 useSendGetSubscriptionMutation
} = privateApiSlice;
