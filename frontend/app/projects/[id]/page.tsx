"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetWorkByIdQuery } from "@/store/services/workApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import areaSVG from "@/public/assets/icons/areaSVG.svg";

const ProjectDetail = () => {
  const params = useParams();
  const { id } = params;
  const lang = useSelector(selectLanguage);
  const {
    data: project,
    error,
    isLoading,
  } = useGetWorkByIdQuery({ id: id as string, lang });

  // Gallery layout component - improved to only show actual images
  const GalleryLayout = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;

    // Make sure we have unique images
    const uniqueImages = [...new Set(images)];

    // If we don't have any images, don't render the gallery
    if (uniqueImages.length < 1) return null;

    // Dynamic gallery layout based on available images
    return (
      <div className="w-full grid grid-cols-1 gap-4">
        {/* First row - two equal columns (if we have at least 2 images) */}
        {uniqueImages.length >= 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900">
              <Image
                src={
                  uniqueImages[0].startsWith("/") ||
                  uniqueImages[0].startsWith("http")
                    ? uniqueImages[0]
                    : `/uploads/${uniqueImages[0]}`
                }
                alt=""
                width={600}
                height={1000}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-neutral-900">
              <Image
                src={
                  uniqueImages[1].startsWith("/") ||
                  uniqueImages[1].startsWith("http")
                    ? uniqueImages[1]
                    : `/uploads/${uniqueImages[1]}`
                }
                alt=""
                width={600}
                height={1000}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* If we only have 1 image, show it in full width */}
        {uniqueImages.length === 1 && (
          <div className="bg-neutral-900">
            <Image
              src={
                uniqueImages[0].startsWith("/") ||
                uniqueImages[0].startsWith("http")
                  ? uniqueImages[0]
                  : `/uploads/${uniqueImages[0]}`
              }
              alt=""
              width={1200}
              height={600}
              unoptimized={true}
              className="w-full h-96 md:h-auto object-cover"
            />
          </div>
        )}

        {/* Second row - full width (if we have at least 3 images) */}
        {uniqueImages.length >= 3 && (
          <div className="bg-neutral-900">
            <Image
              src={
                uniqueImages[2].startsWith("/") ||
                uniqueImages[2].startsWith("http")
                  ? uniqueImages[2]
                  : `/uploads/${uniqueImages[2]}`
              }
              alt=""
              width={1200}
              height={600}
              unoptimized={true}
              className="w-full h-96 md:h-auto object-cover"
            />
          </div>
        )}

        {/* Third row - flexible columns based on available images */}
        {uniqueImages.length > 3 && (
          <div
            className={`grid grid-cols-${Math.min(uniqueImages.length - 3, 3)} gap-4`}
          >
            {uniqueImages.slice(3, 6).map((image, index) => (
              <div key={index} className="bg-neutral-900">
                <Image
                  src={
                    image.startsWith("/") || image.startsWith("http")
                      ? image
                      : `/uploads/${image}`
                  }
                  alt=""
                  width={600}
                  height={600}
                  unoptimized={true}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
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
              src={
                project.images[0].startsWith("/") ||
                project.images[0].startsWith("http")
                  ? project.images[0]
                  : `/uploads/${project.images[0]}`
              }
              alt=""
              width={1200}
              height={800}
              unoptimized={true}
              priority={true}
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
              <h1 className="text-2xl md:text-4xl">
                {project &&
                  typeof project.location === "string" &&
                  project.location}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Image src={areaSVG} alt="area" width={32} height={32} />
              <h1 className="text-2xl md:text-4xl">
                {project && project.area} м²
              </h1>
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
          {project && project.images && project.images.length > 1 && (
            <div className="mt-20">
              {/* Create gallery groups by splitting the images array into chunks of 6 */}
              {Array.from(
                { length: Math.ceil((project.images.length - 1) / 6) },
                (_, i) => {
                  // Get a chunk of 6 images, starting from index 1 (skip the header image)
                  const startIdx = i * 6 + 1;
                  const endIdx = Math.min(startIdx + 6, project.images.length);
                  const galleryImages = project.images.slice(startIdx, endIdx);

                  return (
                    <div key={i} className={i > 0 ? "mt-10" : ""}>
                      <GalleryLayout images={galleryImages} />
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Button Section */}
          <div className="flex justify-center mt-10">
            <Link
              href="/projects"
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
