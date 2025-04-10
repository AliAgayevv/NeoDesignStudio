"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetWorkByIdQuery } from "@/store/services/workApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import areaSVG from "@/public/assets/icons/areaSVG.svg";
import { motion } from "framer-motion";

// Define interfaces for props and data
interface AnimatedImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  delay?: number;
}

interface GalleryLayoutProps {
  images: string[];
  startDelay?: number;
}

// Animated image component
const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
  priority = false,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full h-full"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={true}
        priority={priority}
        className={className}
      />
    </motion.div>
  );
};

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const lang = useSelector(selectLanguage);
  const { data: project, error, isLoading } = useGetWorkByIdQuery({ id, lang });

  // Gallery layout component - improved to only show actual images
  const GalleryLayout: React.FC<GalleryLayoutProps> = ({
    images,
    startDelay = 0,
  }) => {
    if (!images || images.length === 0) return null;

    // Make sure we have unique images
    const uniqueImages = [...new Set(images)];

    // If we don't have any images, don't render the gallery
    if (uniqueImages.length < 1) return null;

    // Helper function for image path processing
    const getImagePath = (imagePath: string): string => {
      return imagePath.startsWith("/") || imagePath.startsWith("http")
        ? imagePath
        : `/uploads/${imagePath}`;
    };

    // Dynamic gallery layout based on available images
    return (
      <div className="w-full grid grid-cols-1 gap-4">
        {/* First row - two equal columns (if we have at least 2 images) */}
        {uniqueImages.length >= 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900">
              <AnimatedImage
                src={getImagePath(uniqueImages[0])}
                alt=""
                width={600}
                height={1000}
                className="w-full h-full object-cover"
                delay={startDelay}
              />
            </div>
            <div className="bg-neutral-900">
              <AnimatedImage
                src={getImagePath(uniqueImages[1])}
                alt=""
                width={600}
                height={1000}
                className="w-full h-full object-cover"
                delay={startDelay + 0.1}
              />
            </div>
          </div>
        )}

        {/* If we only have 1 image, show it in full width */}
        {uniqueImages.length === 1 && (
          <div className="bg-neutral-900">
            <AnimatedImage
              src={getImagePath(uniqueImages[0])}
              alt=""
              width={1200}
              height={600}
              className="w-full h-96 md:h-auto object-cover"
              delay={startDelay}
            />
          </div>
        )}

        {/* Second row - full width (if we have at least 3 images) */}
        {uniqueImages.length >= 3 && (
          <div className="bg-neutral-900">
            <AnimatedImage
              src={getImagePath(uniqueImages[2])}
              alt=""
              width={1200}
              height={600}
              className="w-full h-96 md:h-auto object-cover"
              delay={startDelay + 0.2}
            />
          </div>
        )}

        {/* Third row - flexible columns based on available images */}
        {uniqueImages.length > 3 && (
          <div
            className={`grid ${uniqueImages.length - 3 >= 3 ? "grid-cols-3" : uniqueImages.length - 3 === 2 ? "grid-cols-2" : "grid-cols-1"} gap-4`}
          >
            {uniqueImages.slice(3, 6).map((image, index) => (
              <div key={index} className="bg-neutral-900">
                <AnimatedImage
                  src={getImagePath(image)}
                  alt=""
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  delay={startDelay + 0.3 + index * 0.1}
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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
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
            </motion.div>
          )}
          <motion.div
            className="flex gap-10 mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
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
          </motion.div>
          <motion.div
            className="w-11/12 h-full mx-auto mt-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <h1>
              {project &&
                typeof project?.description === "string" &&
                typeof project.location === "string" &&
                project.description}
            </h1>
          </motion.div>

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
                      <GalleryLayout
                        images={galleryImages}
                        startDelay={0.1 * i} // Slightly staggered delay based on gallery group
                      />
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Button Section */}
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link
              href="/projects"
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Back to Projects
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
