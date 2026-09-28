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

    // GET OUR VALUES
    getOurValues: builder.query({
      query: () => "/our-values",
    }),

    // GET WEB BANNERS
    getWebBanners: builder.query({
      query: () => "/web-pages",
    }),

    // GET FOOTER
    getFooter: builder.query({
      query: () => "/settings",
    }),

    // GET PRIVACY POLICY
    getprivacyPolicy: builder.query({
      query: () => "/pages/privacy_policy",
    }),

    // GET TERMS AND CONDITIONS
    getTermsAndConditions: builder.query({
      query: () => "/pages/trems_and_condition",
    }),

    // GET SUBSCRIBE PRICE
    getSubscribePrice: builder.query({
      query: () => "/subscriptions",
    }),

    // GET PAGE BY SLUG
    getPage: builder.query({
      query: (slug) => `/pages/${slug}`,
    }),

    // GET ASSET CLASSES
    getAssetClasses: builder.query({
      query: () => "/asset-classes",
    }),

    // GET CATEGORIES
    getCategories: builder.query({
      query: () => "/categories",
    }),

    // GET STRATEGIES
    getStrategies: builder.query({
      query: () => "/strategies",
    }),

    // GET TYPES
    getTypes: builder.query({
      query: () => "/types",
    }),

    // GET BLOGS
    getBlog: builder.query({
      query: () => "/blogs",
    }),

    // GET SPONSORS
    getSponsers: builder.query({
      query: () => "/sponsors-list",
    }),

    // GET FUNDS
    getFund: builder.query({
      query: () => "/funds",
    }),

    // GET HEADER
    getHeader: builder.query({
      query: () => "/header",
    }),

    // GET FUND GRAPH DATA
    getFundGraphData: builder.query({
      query: (id) => `/funds/${id}/graph-data`,
    }),

    // FILTER FUNDS
    filterFunds: builder.query({
      query: ({
        asset_class_id,
        category_id,
        type_id,
        strategy_id,
      }) => ({
        url: "/filter-funds",
        params: {
          asset_class_id,
          category_id,
          type_id,
          strategy_id,
        },
      }),
    }),

    // GET BLOG DETAILS
    getBlogDetails: builder.query({
      query: (slug) => `/blog-details/${slug}`,
    }),

    // GET MEDIA
    getMedia: builder.query({
      query: () => "/media",
    }),

    // GET ATL SECTION
    getatlsection: builder.query({
      query: () => "/home-fund-data",
    }),

    // SEND MAIL
    SendMail: builder.mutation({
      query: (data) => ({
        url: "/send-email",
        method: "POST",
        body: data,
      }),
    }),

    // SEND MAIL OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    // VERIFY MAIL OTP
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

    // SEND SUBSCRIBE
    SendSubscribe: builder.mutation({
      query: (data) => ({
        url: "/add-subscribe",
        method: "POST",
        body: data,
      }),
    }),

    // GET COMMENTARY PAGE
    getCommentaryPage: builder.query({
      query: () => "/commentary-page",
    }),

    // GET MEMBER PAGE
    getMemberPage: builder.query({
      query: () => "/member-directory",
    }),

    // GET MEMBER DIRECTORY BY ID
    getMemberDirectoryById: builder.query({
      query: (id) => `/member-directory/${id}`,
    }),

    // GET INSIGHT REPORTS
    getInsightReports: builder.query({
      query: (params = {}) => ({
        url: "/insight-reports",
        params: {
          topic: params.topic || undefined,
          search: params.search || undefined,
          page: params.page || 1,
          per_page: params.per_page || 9,
        },
      }),
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
  useGetMemberPageQuery,
  useGetMemberDirectoryByIdQuery,
  useGetInsightReportsQuery,
} = publicApiSlice;