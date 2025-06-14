import { apiSlice } from "./apiSlice";

// Base multilingual types
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

// Core Work type (what we receive from backend)
type Work = {
  _id?: string;
  projectId: string;
  description: Description;
  title: Title;
  location: Location;
  area: string | number;
  images: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

// Type for upload operations (create - includes projectId)
type UploadWork = {
  projectId: string;
  description: Description;
  title: Title;
  location: Location;
  area: string | number;
  category: string;
};

// Type for update operations (projectId is in URL, not in content)
type UpdateWorkContent = {
  description: Description;
  title: Title;
  location: Location;
  area: string | number;
  category: string;
};

// Backend response wrapper types
type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
  timestamp: string;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
};

// Union type for API responses
type ApiResponse<T> = ApiSuccessResponse<T> | T; // T for backward compatibility

// Specific response types - after transformResponse these will be the actual data
type WorkResponse = Work;
type WorksResponse = Work[];

// Delete image response type
type DeleteImageResponse = ApiResponse<{
  deletedImage: string;
  remainingImages: string[];
  totalImages: number;
}>;

// Update work mutation parameters
type UpdateWorkParams = {
  id: string;
  content?: UpdateWorkContent; // Updated to use UpdateWorkContent
  formData?: FormData;
};

// Create work response
type CreateWorkResponse = ApiResponse<Work>;

export const workApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get work by ID with language support
    getWorkById: builder.query<
      WorkResponse,
      { id: string | number; lang?: string }
    >({
      query: ({ id, lang }) => {
        const params = lang ? `?lang=${lang}` : "";
        return `/portfolio/${id}${params}`;
      },
      transformResponse: (response: any): WorkResponse => {
        console.log("getWorkById response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format (direct work object)
        return response;
      },
    }),

    // Get all works
    getAllWorks: builder.query<WorksResponse, void>({
      query: () => "/portfolio",
      transformResponse: (response: any): Work[] => {
        console.log("getAllWorks response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format (direct array)
        if (Array.isArray(response)) {
          return response;
        }

        // Fallback
        return [];
      },
    }),

    // Get works by category
    getWorkByCategory: builder.query<WorksResponse, { category: string }>({
      query: ({ category }) => `/portfolio?category=${category}`,
      transformResponse: (response: any): Work[] => {
        console.log("getWorkByCategory response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format (direct array)
        if (Array.isArray(response)) {
          return response;
        }

        // Fallback
        return [];
      },
    }),

    // Create new work
    createWork: builder.mutation<CreateWorkResponse, FormData>({
      query: (formData) => {
        console.log("Creating work with FormData");
        return {
          url: "/portfolio",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response: any): Work => {
        console.log("createWork response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format
        return response;
      },
    }),

    // Update existing work
    updateWork: builder.mutation<CreateWorkResponse, UpdateWorkParams>({
      query: ({ id, content, formData }) => {
        console.log("Updating work:", {
          id,
          hasContent: !!content,
          hasFormData: !!formData,
        });

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
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response: any): Work => {
        console.log("updateWork response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format
        return response;
      },
    }),

    // Delete work
    deleteWork: builder.mutation<ApiResponse<{ projectId: string }>, string>({
      query: (id) => {
        console.log("Deleting work:", id);
        return {
          url: `/portfolio/${id}`,
          method: "DELETE",
        };
      },
      transformResponse: (response: any) => {
        console.log("deleteWork response:", response);
        return response;
      },
    }),

    // Delete image from work
    deleteImage: builder.mutation<
      DeleteImageResponse,
      { projectId: string; imagePath: string }
    >({
      query: ({ projectId, imagePath }) => {
        console.log("Deleting image:", { projectId, imagePath });
        return {
          url: `/portfolio/${projectId}/images`,
          method: "DELETE",
          body: { imagePath },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response: any) => {
        console.log("deleteImage response:", response);

        // Handle new backend format
        if (response?.success && response?.data) {
          return response.data;
        }

        // Handle old format
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllWorksQuery,
  useGetWorkByIdQuery,
  useGetWorkByCategoryQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
  useDeleteImageMutation,
} = workApi;

// Export types for use in components
export type {
  Work,
  UploadWork,
  UpdateWorkContent,
  Description,
  Title,
  Location,
  ApiSuccessResponse,
  ApiErrorResponse,
  WorkResponse,
  WorksResponse,
  UpdateWorkParams,
};
