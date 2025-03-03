import { apiSlice } from "./apiSlice";

// Updated WorkContent and Work types
type WorkContent = {
  az: { title: string; [key: string]: any };
  en: { title: string; [key: string]: any };
  ru: { title: string; [key: string]: any };
};

type Work = {
  projectId: string;
  images: string[];
  content: WorkContent;
};

export const workApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWorks: builder.query<Work[], void>({
      query: () => "/portfolio",
    }),
    getWorkById: builder.query<Work, { id: string; lang: string }>({
      query: ({ id, lang }) => `portfolio/${id}?lang=${lang}`,
    }),
    createWork: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "portfolio",
        method: "POST",
        body: formData,
        headers: {
          // FormData kullanırken bu header'ı elle eklemene gerek yok
        },
      }),
    }),

    updateWork: builder.mutation<void, { id: string; content: WorkContent }>({
      query: ({ id, content }) => ({
        url: `portfolio/${id}`,
        method: "PUT",
        body: { content },
      }),
    }),
    deleteWork: builder.mutation<void, string>({
      query: (id) => ({
        url: `portfolio/${id}`,
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
