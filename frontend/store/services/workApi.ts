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
  projectId: string; // Proje ID'si
  description: Description; // Açıklama (Her dilde)
  title: Title; // Başlık (Her dilde)
  location: Location; // Konum (Her dilde)
  area: string; // Alan, genelde şehir adı gibi string olur
  images: string[]; // Görsellerin URL'leri
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
    createWork: builder.mutation<void, Work>({
      query: (newWork) => ({
        url: "/portfolio",
        method: "POST",
        body: newWork,
      }),
    }),
    updateWork: builder.mutation<void, { id: string; content: Work }>({
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
