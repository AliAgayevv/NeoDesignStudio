import { NapiMiddleware } from "next/dist/build/swc/generated-native";
import { apiSlice } from "./apiSlice";

type Description = {
  az: string;
  en: string;
  ru: string;
};

type Title = {
  az: string;
  en: string;
  ru: string;
};

type Location = {
  az: string;
  en: string;
  ru: string;
};

type Work = {
  projectId: string;
  description: Description;
  title: Title;
  location: Location;
  area: string | number;
  images: string[];
};

type UploadWork = {
  projectId: string;
  description: Description;
  title: Title;
  location: Location;
  area: string | number;
};

export const workApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkById: builder.query<Work, { id: string | number; lang: string }>({
      query: ({ id, lang }) => `/portfolio/${id}?lang=${lang}`,
    }),
    getAllWorks: builder.query<Work[], void>({
      // Type the response to be an array of `Work` objects
      query: () => "/portfolio",
    }),
    createWork: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/portfolio",
        method: "POST",
        body: formData,
        // Don't set Content-Type header here, the browser will set it correctly
        formData: true, // This tells RTK Query that you're sending FormData
      }),
    }),
    updateWork: builder.mutation<void, { id: string; content: UploadWork }>({
      query: ({ id, content }) => ({
        url: `/portfolio/${id}`,
        method: "PUT",
        body: { content },
      }),
    }),
    deleteWork: builder.mutation<void, string>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllWorksQuery,
  useGetWorkByIdQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} = workApi;
