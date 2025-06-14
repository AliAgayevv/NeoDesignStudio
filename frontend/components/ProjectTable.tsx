import React, { useEffect, useState } from "react";
import { Project } from "./types";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import { useDeleteWorkMutation } from "@/store/services/workApi";

export default function ProjectTable({
  onEdit,
}: {
  onEdit: (project: Project) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllWorksQuery();
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();

  useEffect(() => {
    // Backend'den gelen data yapısını handle et
    // Backend artık { success: true, data: [...], message: "..." } formatında döndürebiliyor
    // VEYA direkt array olarak döndürebiliyor (eski format)
    let extractedData;

    if (apiResponse) {
      // Yeni format: { success: true, data: [...] }
      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        extractedData = apiResponse.data;
      }
      // Eski format: direkt array
      else if (Array.isArray(apiResponse)) {
        extractedData = apiResponse;
      }
      // Fallback
      else {
        extractedData = [];
        console.warn("Unexpected API response format:", apiResponse);
      }

      console.log("API Response:", apiResponse);
      console.log("Extracted Data:", extractedData);

      if (Array.isArray(extractedData)) {
        setProjects(
          extractedData.map((work: any) => ({
            _id: work._id,
            projectId: work.projectId,
            images: work.images || [],
            description: work.description || {},
            title: work.title || {},
            location: work.location || {},
            area: work.area || 0,
            category: work.category || "",
          })),
        );
      }
    }
  }, [apiResponse]);

  const handleDelete = async (projectId: string) => {
    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      try {
        console.log(`Deleting project: ${projectId}`);
        await deleteWork(projectId).unwrap();

        // Başarılı silme sonrası local state'i güncelle
        setProjects(projects.filter((p) => p.projectId !== projectId));

        // Veya sayfayı yenile
        refetch();

        console.log(`✓ Project deleted successfully: ${projectId}`);
      } catch (error) {
        console.error("Delete error:", error);
        alert("Proje silinirken hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("ProjectTable API Error:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading projects
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load projects. Please try again.</p>
              <button
                onClick={() => refetch()}
                className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No projects state
  if (!projects || projects.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m0 0V9a2 2 0 012-2h2a2 2 0 012 2v4m0 0h6m-6 0l1 5.4M7 19l1 5.4M17 19l1 5.4m-1-8.4V9a2 2 0 012-2h2a2 2 0 012 2v2.4M7 19h10m0 0l1 8.4M17 19l1 8.4m-1-8.4l1-5.4m0 0h6l1 5.4M17 11h2a2 2 0 012 2v2.4M7 19h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Images
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr
              key={project._id || project.projectId}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {project.projectId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.title?.en || project.title?.az || "No title"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.location?.en || project.location?.az || "No location"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.area} m²
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {project.category
                    ? project.category.slice(0, 1).toUpperCase() +
                      project.category.slice(1)
                    : "No category"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.images?.length || 0} images
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.projectId)}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
