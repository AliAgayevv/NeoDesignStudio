import ProjectDetail from "@/components/ProjectDetail";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const project = await fetch(
    `https://neodesignstudio.az/api/portfolio/${id}?lang=en`,
  ).then((res) => res.json());

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: project.title || "Project Detail",
    description:
      project.description ||
      "Discover detailed information about this project.",
    openGraph: {
      images: [project.images?.[0] || "/default-image.jpg", ...previousImages],
    },
  };
}

// Page Component
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `https://neodesignstudio.az/api/portfolio/${id}?lang=en`,
  );
  const project = await res.json();

  if (!project || project.error) {
    return <div>No project found.</div>;
  }

  return (
    <div>
      <ProjectDetail />
    </div>
  );
}
