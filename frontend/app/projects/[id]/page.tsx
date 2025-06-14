import ProjectDetail from "@/components/ProjectDetail";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Dynamic Metadata with proper error handling
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { id } = await params;
    console.log(`Generating metadata for project: ${id}`);

    // Fetch project data with error handling
    const response = await fetch(
      `https://neodesignstudio.az/api/portfolio/${id}?lang=en`,
      {
        cache: "no-store", // Always get fresh data for metadata
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch project ${id}:`,
        response.status,
        response.statusText,
      );
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("API Response for metadata:", responseData);

    // Handle both old and new backend response formats
    let project;
    if (responseData.success && responseData.data) {
      // New format: { success: true, data: {...}, message: "..." }
      project = responseData.data;
    } else if (responseData.projectId || responseData.title) {
      // Old format: direct project object
      project = responseData;
    } else {
      // Fallback
      console.warn("Unexpected API response format:", responseData);
      project = responseData;
    }

    console.log("Processed project data:", project);

    // Extract metadata with fallbacks
    const title = project?.title || `Project ${id}`;
    const description =
      project?.description ||
      "Discover detailed information about this project.";
    const area = project?.area;
    const location = project?.location;

    // Build metadata title
    let metaTitle =
      typeof title === "string"
        ? title
        : title?.en || title?.az || `Project ${id}`;
    if (area && location) {
      const locationText =
        typeof location === "string"
          ? location
          : location?.en || location?.az || "";
      metaTitle += ` - ${area}m² in ${locationText}`;
    }

    // Build metadata description
    let metaDescription =
      typeof description === "string"
        ? description
        : description?.en ||
          description?.az ||
          "Discover detailed information about this project.";

    // Get previous metadata
    const previousImages = (await parent).openGraph?.images || [];

    // Process image URL
    let imageUrl = "/default-image.jpg";
    if (project?.images && project.images.length > 0) {
      const firstImage = project.images[0];
      if (firstImage.startsWith("http")) {
        imageUrl = firstImage;
      } else {
        imageUrl = `https://neodesignstudio.az${firstImage}`;
      }
    }

    console.log("Generated metadata:", {
      title: metaTitle,
      description: metaDescription,
      imageUrl,
    });

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: [
        "interior design",
        "architecture",
        "Azerbaijan",
        "Baku",
        "design project",
        project?.category || "design",
      ].join(", "),
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "article",
        url: `https://neodesignstudio.az/projects/${id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: metaTitle,
          },
          ...previousImages,
        ],
        siteName: "Neo Design Studio",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata when API fails
    const { id } = await params;
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `Project ${id} - Neo Design Studio`,
      description:
        "Discover our latest interior design project featuring modern architecture and innovative solutions.",
      openGraph: {
        title: `Project ${id} - Neo Design Studio`,
        description:
          "Discover our latest interior design project featuring modern architecture and innovative solutions.",
        type: "article",
        url: `https://neodesignstudio.az/projects/${id}`,
        images: ["/default-image.jpg", ...previousImages],
        siteName: "Neo Design Studio",
      },
      twitter: {
        card: "summary_large_image",
        title: `Project ${id} - Neo Design Studio`,
        description:
          "Discover our latest interior design project featuring modern architecture and innovative solutions.",
        images: ["/default-image.jpg"],
      },
    };
  }
}

// Page Component with error boundary
export default async function ProjectDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    console.log(`Rendering ProjectDetailPage for: ${id}`);

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
            The project you're looking for could not be loaded.
          </p>
          <a
            href="/projects"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Projects
          </a>
        </div>
      </div>
    );
  }
}
