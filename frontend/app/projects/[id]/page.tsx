"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetWorkByIdQuery } from "@/store/services/workApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import areaSVG from "../../../public/assets/icons/areaSVG.svg";

const ProjectDetail = () => {
  const params = useParams();
  const { id } = params;
  const lang = useSelector(selectLanguage);
  const {
    data: project,
    error,
    isLoading,
  } = useGetWorkByIdQuery({ id: id as string, lang });
  const [imageLimit, setImageLimit] = useState(2);

  // Function to show more images
  const handleShowMoreImages = () => {
    setImageLimit(imageLimit + 7);
  };

  // Function to go back to projects

  // Gallery layout component
  const GalleryLayout = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="w-full grid grid-cols-1 gap-4">
        {/* First row - two equal columns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900">
            <Image
              src={`https://neodesignstudio.onrender.com${images[0]}`}
              alt=""
              width={600}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-neutral-900">
            <Image
              src={`https://neodesignstudio.onrender.com${images[1] || images[0]}`}
              alt=""
              width={600}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Second row - full width */}
        <div className="h-96 bg-neutral-900">
          <Image
            src={`https://neodesignstudio.onrender.com${images[2] || images[0]}`}
            alt=""
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Third row - three equal columns */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-900">
            <Image
              src={`https://neodesignstudio.onrender.com${images[3] || images[0]}`}
              alt=""
              width={600}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-neutral-900">
            <Image
              src={`https://neodesignstudio.onrender.com${images[4] || images[1] || images[0]}`}
              alt=""
              width={1000}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-neutral-900">
            <Image
              src={`https://neodesignstudio.onrender.com${images[5] || images[2] || images[0]}`}
              alt=""
              width={1000}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-11/12 mx-auto pb-24">
        <div className="pt-40 w-full">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading project details</p>}
          {project && project.images && project.images.length > 0 && (
            <Image
              src={`https://neodesignstudio.onrender.com${project.images[0]}`}
              alt=""
              width={648}
              height={543}
              decoding="async"
              priority
              className="object-cover w-full h-full md:h-[80vh]"
            />
          )}
          <div className="flex gap-10 mt-10">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <h1 className="text-4xl">
                {project &&
                  typeof project.location === "string" &&
                  project.location}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Image src={areaSVG} alt="area" width={32} height={32} />
              <h1 className="text-4xl">{project && project.area} м²</h1>
            </div>
          </div>
          <div className="w-11/12 h-full mx-auto mt-10 text-center">
            <h1>
              {project &&
                typeof project?.description === "string" &&
                typeof project.location === "string" &&
                project.description}
            </h1>
          </div>

          {/* Gallery Section */}
          {project && project.images && project.images.length > 0 && (
            <div className="mt-20">
              {/* Divide images into groups of 6 for the gallery layout */}
              {Array.from(
                {
                  length: Math.ceil(
                    Math.min(imageLimit, project.images.length) / 6,
                  ),
                },
                (_, index) => (
                  <div key={index} className={index > 0 ? "mt-10" : ""}>
                    <GalleryLayout
                      images={project.images.slice(
                        index * 6 + 1,
                        Math.min(index * 6 + 7, project.images.length),
                      )}
                    />
                  </div>
                ),
              )}

              {/* Button Section */}
              <div className="flex justify-center mt-10">
                {imageLimit < project.images.length ? (
                  <button
                    onClick={handleShowMoreImages}
                    className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    More
                  </button>
                ) : (
                  <Link
                    href="/projects"
                    className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    Back to Projects
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
