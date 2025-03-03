import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://neodesignstudio.onrender.com/api",
    // Don't manually set Content-Type for FormData requests
    // The browser will automatically set the correct multipart/form-data with boundary
    prepareHeaders: (headers, { getState }) => {
      // You can add auth headers here if needed
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
