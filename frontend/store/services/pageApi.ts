// pageApi.ts (Page API Slice - TypeScript)
import { apiSlice } from "./apiSlice";

type PageContent = {
  tr: object;
  en: object;
  ru: object;
};

type Page = {
  page: string;
  pageType: string;
  content: PageContent[];
};

export const pageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPage: builder.query<Page, { page: string; lang: string }>({
      query: ({ page, lang }) => `/pages/${page}?lang=${lang}`,
    }),
    createPage: builder.mutation<void, Page>({
      query: (newPage) => ({
        url: "/page",
        method: "POST",
        body: newPage,
      }),
    }),
    updatePage: builder.mutation<void, { page: string; content: PageContent }>({
      query: ({ page, content }) => ({
        url: `/page/${page}`,
        method: "PUT",
        body: { content },
      }),
    }),
  }),
});

export const { useGetPageQuery, useCreatePageMutation, useUpdatePageMutation } =
  pageApi;
