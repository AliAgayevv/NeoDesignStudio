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
      query: () => "/portfolio",
    }),

    createWork: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/portfolio",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),

    updateWork: builder.mutation<
      void,
      { id: string; content: UploadWork; formData?: FormData }
    >({
      query: ({ id, content, formData }) => {
        // If formData is provided, use it for image updates
        if (formData) {
          return {
            url: `/portfolio/${id}`,
            method: "PUT",
            body: formData,
            formData: true,
          };
        }

        // Otherwise use regular JSON update
        return {
          url: `/portfolio/${id}`,
          method: "PUT",
          body: { content },
        };
      },
    }),

    deleteWork: builder.mutation<void, string>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: "DELETE",
      }),
    }),

    deleteImage: builder.mutation<
      { message: string; remainingImages: string[] },
      { projectId: string; imagePath: string }
    >({
      query: ({ projectId, imagePath }) => ({
        url: `/portfolio/${projectId}/images`,
        method: "DELETE",
        body: { imagePath },
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
  useDeleteImageMutation,
} = workApi;
