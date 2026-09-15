import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApiSlice = createApi({
  reducerPath: "publicApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  endpoints: (builder) => ({

    // GET USERS
    getUsers: builder.query({
      query: () => "/users",
    }),

    // GET BANNERS
    getBanners: builder.query({
      query: () => "/banners",
    }),

    //GET Our Values
    getOurValues: builder.query({
      query: () => "/our-values",
    }),

    //GET Banners
    getWebBanners: builder.query({
      query: () => "/web-pages",
    }),

    //Get Footer
    getFooter: builder.query({
      query: () => "/settings",
    }),

    //Get Privacy Policy
    getprivacyPolicy: builder.query({
      query: () => "/pages/privacy_policy",
    }),

    //Get Terms and Conditions
    getTermsAndConditions: builder.query({
      query: () => "pages/trems_and_condition",
    }),

    //Get Subscribe price
    getSubscribePrice: builder.query({
      query: () => "/subscriptions",
    }),

    getPage: builder.query({
      query: (slug) => `/pages/${slug}`,
    }),

    //Get Assets Classes
    getAssetClasses: builder.query({
      query: () => "/asset-classes",
    }),

    //Get Types of Categories 
    getCategories: builder.query({
      query: () => "/categories",
    }),

    //get Types of Strategies
    getStrategies: builder.query({
      query: () => "/strategies",
    }),

    //get Types of Types
    getTypes: builder.query({
      query: () => "/types",
    }),

    //get Blogs
    getBlog: builder.query({
      query: () => "/blogs",
    }),

    //Get Sponsers
    getSponsers: builder.query({
      query: () => "/sponsors-list"
    }),

    //Get Fund
    getFund: builder.query({
      query: () => "/funds"
    }),

    getHeader: builder.query({
      query: () => "/header",
    }),


    getFundGraphData: builder.query({
      query: (id) => `/funds/${id}/graph-data`
    }),

    // Filter Funds
    filterFunds: builder.query({
      query: ({ asset_class_id, category_id, type_id, strategy_id }) => ({
        url: "/filter-funds",
        params: {
          asset_class_id,
          category_id,
          type_id,
          strategy_id,
        },
      }),
    }),

    //Get Blogdetails
    getBlogDetails: builder.query({
      query: (slug) => `blog-details/${slug}`,
    }),

    getMedia: builder.query({
      query: () => "media",
    }),

    getatlsection: builder.query({
      query: () => "home-fund-data",
    }),
    
    // SEND mail
    SendMail: builder.mutation({
      query: (data) => ({
        url: "/send-email",
        method: "POST",
        body: data,
      }),
    }),

    //SEND MAIL OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    //verify MAIL OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // SEND CONTACT FORM
    sendContactForm: builder.mutation({
      query: (data) => ({
        url: "/contact-submit",
        method: "POST",
        body: data,
      }),
    }),

    //SEND Subscribe SUBSCRIPTION
    SendSubscribe: builder.mutation({
      query: (data) => ({
        url: "/add-subscribe",
        method: "POST",
        body: data,
      }),
    }),

    SendSubscribe: builder.mutation({
      query: (data) => ({
        url: "/add-subscribe",
        method: "POST",
        body: data,
      }),
    }),

    getCommentaryPage: builder.query({
      query: () => "/commentary-page",
    }),

    getMemberPage: builder.query({
      query: () => "/member-directory",
    }),

  }),
});

export const {
  useGetUsersQuery,
  useSendMailMutation,
  useGetBannersQuery,
  useGetOurValuesQuery,
  useGetWebBannersQuery,
  useGetFooterQuery,
  useGetprivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useGetSubscribePriceQuery,
  useGetAssetClassesQuery,
  useGetCategoriesQuery,
  useGetStrategiesQuery,
  useGetTypesQuery,
  useGetBlogQuery,
  useGetSponsersQuery,
  useGetFundGraphDataQuery,
  useGetFundQuery,
  useFilterFundsQuery,
  useSendContactFormMutation,
  useSendSubscribeMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetHeaderQuery,
  useGetPageQuery,
  useGetMediaQuery,
  useGetatlsectionQuery,
  useGetCommentaryPageQuery,
  useGetMemberPageQuery
} = publicApiSlice;
