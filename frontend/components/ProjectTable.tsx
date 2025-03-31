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

  const { data } = useGetAllWorksQuery();
  const [deleteWork] = useDeleteWorkMutation();

  useEffect(() => {
    if (data) {
      setProjects(
        data.map((work: any) => ({
          _id: work._id,
          projectId: work.projectId,
          images: work.images,
          description: work.description,
          title: work.title,
          location: work.location,
          area: work.area,
          category: work.category,
        })),
      );
      console.log(data);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    deleteWork(id);
    setProjects(projects.filter((p) => p._id !== id));
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">Project ID</th>
            <th className="px-6 py-3 text-left">Title</th>
            <th className="px-6 py-3 text-left">Location </th>
            <th className="px-6 py-3 text-left">Area </th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left flex justify-end mr-10">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-t">
              <td className="px-6 py-4">{project.projectId}</td>
              <td className="px-6 py-4">{project.title.en}</td>
              {/* Display the location in English (project.location.en) */}
              <td className="px-6 py-4">{project.location.en}</td>
              {/* Display the area in m² */}
              <td className="px-6 py-4">{project.area} m²</td>
              <td className="px-6 py-4">
                {project.category &&
                  project.category
                    .slice(0, 1)
                    .toUpperCase()
                    .concat(project.category.slice(1))}
              </td>
              <td className="px-6 py-4 space-x-2 flex justify-end">
                <button
                  onClick={() => onEdit(project)}
                  className="text-white hover:text-indigo-900 border px-4 rounded-lg bg-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.projectId)}
                  className="text-white hover:text-red-900 border px-4 py-2 rounded-lg bg-red-600 "
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
