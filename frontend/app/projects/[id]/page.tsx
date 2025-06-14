import ProjectDetail from "@/components/ProjectDetail";

import Link from "next/link";
import React from "react";

// Page Component with error boundary
export default function ProjectDetailPage() {
  try {
    return (
      <div className="min-h-screen">
        <ProjectDetail />
      </div>
    );
  } catch (error) {
    console.error("Error in ProjectDetailPage:", error);

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-6">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/projects"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
}
