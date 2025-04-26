import ProjectDetail from "@/components/ProjectDetail";
import { Metadata } from "next";
import React from "react";

interface ProjectDetailProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: ProjectDetailProps): Promise<Metadata> {
  const res = await fetch(
    `https://neodesignstudio.az/api/portfolio/${id}?lang=en`,
  );
  const project: any = await res.json();
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      images: [
        {
          url: project.images[0],
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailProps) {
  const { id } = params;
  const res = await fetch(
    `https://neodesignstudio.az/api/portfolio/${id}?lang=en`,
  );
  const data = await res.json();

  return (
    <div>
      <ProjectDetail />
    </div>
  );
}
