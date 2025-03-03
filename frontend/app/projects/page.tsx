"use client";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import { useGetAllWorksQuery } from "@/store/services/workApi";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфолио",
  az: "Portfel",
};

// Update this to match your backend URL
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://neodesignstudio.onrender.com";

const Page = () => {
  const lang = useSelector(selectLanguage);
  const { data, isLoading, error } = useGetAllWorksQuery();
  const [imageLoadError, setImageLoadError] = useState<{
    [key: string]: boolean;
  }>({});
  const [debug, setDebug] = useState(null);

  // Debug endpoint to check uploads directory
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      fetch(`${BACKEND_URL}/api/test-uploads`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Upload directory info:", data);
          setDebug(data);
        })
        .catch((err) => console.error("Error fetching upload info:", err));
    }
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data: {error.toString()}</p>;

  console.log("Portfolio data:", data);

  // Function to handle image URL formatting
  const getImageUrl = (imagePath: any) => {
    if (!imagePath) return null;

    // If the path is already a full URL
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Clean the path by removing any duplicate slashes
    let cleanPath = imagePath;
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.substring(1);
    }

    // Make sure we don't duplicate "uploads/" in the path
    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath;
    } else {
      cleanPath = `uploads/${cleanPath}`;
    }

    // Return the full URL
    const fullUrl = `${BACKEND_URL}/${cleanPath}`;
    console.log("Image URL:", fullUrl);
    return fullUrl;
  };

  // Function to handle image load errors
  const handleImageError = (id: any, url: any) => {
    console.error(`Failed to load image for project ${id} from URL: ${url}`);
    setImageLoadError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-screen h-auto min-h-screen bg-black relative z-0 text-white">
      <div className="w-11/12 mx-auto">
        <div className="pt-48">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>

        {debug && process.env.NODE_ENV === "development" && (
          <div className="bg-gray-800 p-4 my-4 rounded">
            <h3>Debug Info:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        )}

        <div className="py-12">
          {data?.map((work) => {
            const imageUrl =
              work.images && work.images.length > 0
                ? getImageUrl(work.images[0])
                : null;

            return (
              <div
                key={work.projectId}
                className="w-full h-[400px] relative my-8 rounded-lg overflow-hidden"
              >
                {imageUrl && !imageLoadError[work.projectId] ? (
                  <>
                    <Image
                      src={imageUrl}
                      width={1920}
                      height={1080}
                      alt={work.content[lang]?.title || "Project image"}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(work.projectId, imageUrl)}
                      priority
                      unoptimized={true} // Try this to bypass Next.js image optimization
                    />
                    {process.env.NODE_ENV === "development" && (
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-1 text-xs">
                        {imageUrl}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <p>Image not available</p>
                  </div>
                )}
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col items-center justify-center p-6">
                  <h1 className="text-4xl mb-4">{work.content[lang]?.title}</h1>
                  <p className="text-xl text-center max-w-3xl">
                    {work.content[lang]?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
