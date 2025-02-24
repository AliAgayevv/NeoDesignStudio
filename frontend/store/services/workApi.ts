import { apiSlice } from './apiSlice'

type WorkContent = {
  tr: object
  en: object
  ru: object
}

type Work = {
  projectId: string
  page: string
  pageType: string
  images: string[]
  content: WorkContent
}

export const workApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkById: builder.query<Work, { id: string; lang: string }>({
      query: ({ id, lang }) => `/work/${id}?lang=${lang}`,
    }),
    createWork: builder.mutation<void, Work>({
      query: (newWork) => ({
        url: '/work',
        method: 'POST',
        body: newWork,
      }),
    }),
    updateWork: builder.mutation<void, { id: string; content: WorkContent }>({
      query: ({ id, content }) => ({
        url: `/work/${id}`,
        method: 'PUT',
        body: { content },
      }),
    }),
    deleteWork: builder.mutation<void, string>({
      query: (id) => ({
        url: `/work/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetWorkByIdQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} = workApi
