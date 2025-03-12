"use client";

import { useState } from "react";
import { useAuth } from "@/store/services/useAuth";
import ProjectTable from "@/components/ProjectTable";
import ProjectForm from "@/components/ProjectForm";
import { Project } from "@/components/types";

export default function Dashboard() {
  useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mt-40"
        >
          Add New Project
        </button>
      </div>

      <ProjectTable
        onEdit={(project) => {
          setSelectedProject(project);
          setIsFormOpen(true);
        }}
      />

      {isFormOpen && (
        <ProjectForm
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProject(null);
          }}
          initialValues={selectedProject}
        />
      )}
    </div>
  );
}
