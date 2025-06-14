"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetWorkByIdQuery } from "@/store/services/workApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import areaSVG from "@/public/assets/icons/areaSVG.svg";
import { motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";

// Define interfaces for props and data
interface AnimatedImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  delay?: number;
  onClick?: () => void;
}

interface GalleryLayoutProps {
  images: string[];
  startDelay?: number;
  onImageClick: (index: number) => void;
}

interface ImageFocusProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
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
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={true}
        priority={priority}
        className={className}
        onError={(e) => {
          e.currentTarget.src = "/placeholder-image.png";
        }}
      />
    </motion.div>
  );
};

// Image Focus Modal Component with Touch Swipe and Animations
const ImageFocus: React.FC<ImageFocusProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  // State for tracking touch events
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Minimum swipe distance required (in pixels)
  const minSwipeDistance = 50;

  // Helper function for image path processing
  const getImagePath = (imagePath: string): string => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}${imagePath}`;
    }
    if (imagePath.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}${imagePath}`;
    }
    return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}/uploads/${imagePath}`;
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setSwipeDirection("left");
      onNavigate(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setSwipeDirection("right");
      onNavigate(currentIndex - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Setup keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSwipeDirection("right");
        onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setSwipeDirection("left");
        onNavigate(currentIndex + 1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onNavigate, onClose]);

  // Get animation variants for the image transition
  const getAnimationVariants = () => {
    const variants = {
      enter: {
        x:
          swipeDirection === "left"
            ? 300
            : swipeDirection === "right"
              ? -300
              : 0,
        opacity: 0,
      },
      center: { x: 0, opacity: 1 },
      exit: {
        x:
          swipeDirection === "left"
            ? -300
            : swipeDirection === "right"
              ? 300
              : 0,
        opacity: 0,
      },
    };
    return variants;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          onClick={onClose}
        >
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Navigation buttons - only show on desktop */}
        {!isMobile && currentIndex > 0 && (
          <button
            className="absolute left-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSwipeDirection("right");
              onNavigate(currentIndex - 1);
            }}
          >
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {!isMobile && currentIndex < images.length - 1 && (
          <button
            className="absolute right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSwipeDirection("left");
              onNavigate(currentIndex + 1);
            }}
          >
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {/* Focused image with touch event handlers */}
        <div
          className="w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={currentIndex}
            initial="enter"
            animate="center"
            exit="exit"
            variants={getAnimationVariants()}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={getImagePath(images[currentIndex])}
              alt={`Project image ${currentIndex + 1}`}
              width={1600}
              height={1200}
              unoptimized={true}
              className="max-w-full max-h-full object-contain"
              draggable={false}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
          </motion.div>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const lang = useSelector(selectLanguage);
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetWorkByIdQuery({ id, lang });

  // State for focused image
  const [focusedImageIndex, setFocusedImageIndex] = useState<number | null>(
    null,
  );

  // Extract project data from API response (handle both old and new formats)
  const project = React.useMemo(() => {
    if (!apiResponse) return null;

    console.log("API Response in ProjectDetail:", apiResponse);

    // Handle new backend format: { success: true, data: {...}, message: "..." }
    if (apiResponse.success && apiResponse.data) {
      return apiResponse.data;
    }

    // Handle old format: direct project object
    if (apiResponse.projectId || apiResponse.title) {
      return apiResponse;
    }

    // Fallback
    return apiResponse;
  }, [apiResponse]);

  console.log("Processed project data:", project);

  // Helper function for image path processing
  const getImagePath = (imagePath: string): string => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}${imagePath}`;
    }
    if (imagePath.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}${imagePath}`;
    }
    return `${process.env.NEXT_PUBLIC_API_URL || "https://neodesignstudio.az"}/uploads/${imagePath}`;
  };

  // Helper function to get text content (handle both string and object formats)
  const getTextContent = (content: any): string => {
    if (typeof content === "string") {
      return content;
    }
    if (typeof content === "object" && content !== null) {
      // Try to get content in current language, fallback to English, then any available language
      return (
        content[lang] || content["en"] || content["az"] || content["ru"] || ""
      );
    }
    return "";
  };

  // Gallery layout component
  const GalleryLayout: React.FC<GalleryLayoutProps> = ({
    images,
    startDelay = 0,
    onImageClick,
  }) => {
    if (!images || images.length === 0) return null;

    const uniqueImages = [...new Set(images)];
    if (uniqueImages.length < 1) return null;

    return (
      <div className="w-full grid grid-cols-1 gap-4">
        {/* First row - two equal columns (if we have at least 2 images) */}
        {uniqueImages.length >= 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 rounded-lg overflow-hidden">
              <AnimatedImage
                src={getImagePath(uniqueImages[0])}
                alt={`Gallery image 1`}
                width={600}
                height={1000}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                delay={startDelay}
                onClick={() => onImageClick(0)}
              />
            </div>
            <div className="bg-neutral-900 rounded-lg overflow-hidden">
              <AnimatedImage
                src={getImagePath(uniqueImages[1])}
                alt={`Gallery image 2`}
                width={600}
                height={1000}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                delay={startDelay + 0.1}
                onClick={() => onImageClick(1)}
              />
            </div>
          </div>
        )}

        {/* If we only have 1 image, show it in full width */}
        {uniqueImages.length === 1 && (
          <div className="bg-neutral-900 rounded-lg overflow-hidden">
            <AnimatedImage
              src={getImagePath(uniqueImages[0])}
              alt={`Gallery image 1`}
              width={1200}
              height={600}
              className="w-full h-96 md:h-auto object-cover hover:scale-105 transition-transform duration-300"
              delay={startDelay}
              onClick={() => onImageClick(0)}
            />
          </div>
        )}

        {/* Second row - full width (if we have at least 3 images) */}
        {uniqueImages.length >= 3 && (
          <div className="bg-neutral-900 rounded-lg overflow-hidden">
            <AnimatedImage
              src={getImagePath(uniqueImages[2])}
              alt={`Gallery image 3`}
              width={1200}
              height={600}
              className="w-full h-96 md:h-auto object-cover hover:scale-105 transition-transform duration-300"
              delay={startDelay + 0.2}
              onClick={() => onImageClick(2)}
            />
          </div>
        )}

        {/* Third row - flexible columns based on available images */}
        {uniqueImages.length > 3 && (
          <div
            className={`grid ${
              uniqueImages.length - 3 >= 3
                ? "grid-cols-3"
                : uniqueImages.length - 3 === 2
                  ? "grid-cols-2"
                  : "grid-cols-1"
            } gap-4`}
          >
            {uniqueImages.slice(3, 6).map((image, index) => (
              <div
                key={index}
                className="bg-neutral-900 rounded-lg overflow-hidden"
              >
                <AnimatedImage
                  src={getImagePath(image)}
                  alt={`Gallery image ${index + 4}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  delay={startDelay + 0.3 + index * 0.1}
                  onClick={() => onImageClick(index + 3)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Function to handle image focus
  const handleImageFocus = (index: number, baseIndex: number = 0) => {
    const actualIndex = baseIndex + index;
    setFocusedImageIndex(actualIndex);
  };

  // Function to handle image navigation
  const handleImageNavigation = (index: number) => {
    setFocusedImageIndex(index);
  };

  // Function to close focused image
  const closeFocusedImage = () => {
    setFocusedImageIndex(null);
  };

  // Calculate all available images for focus view
  const getAllImages = () => {
    if (!project || !project.images) return [];
    return project.images;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("ProjectDetail API Error:", error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Project</h1>
          <p className="text-gray-400 mb-6">
            {error?.data?.message ||
              "Failed to load project details. Please try again."}
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

  // No project data
  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-6">
            The project you're looking for could not be found.
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

  // Get project content
  const projectTitle = getTextContent(project.title);
  const projectDescription = getTextContent(project.description);
  const projectLocation = getTextContent(project.location);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-11/12 mx-auto pb-24">
        <div className="pt-40 w-full">
          {/* Main Hero Image */}
          {project.images && project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="cursor-pointer rounded-lg overflow-hidden bg-neutral-900"
              onClick={() => setFocusedImageIndex(0)}
            >
              <Image
                src={getImagePath(project.images[0])}
                alt={projectTitle || "Project main image"}
                width={1200}
                height={800}
                unoptimized={true}
                priority={true}
                className="object-cover w-full h-full md:h-[80vh] hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png";
                }}
              />
            </motion.div>
          )}

          {/* Project Info */}
          <motion.div
            className="flex flex-col md:flex-row gap-6 md:gap-10 mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            {projectLocation && (
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
                  className="text-gray-400"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2 className="text-xl md:text-3xl">{projectLocation}</h2>
              </div>
            )}

            {project.area && (
              <div className="flex items-center gap-2">
                <Image
                  src={areaSVG}
                  alt="area"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
                <h2 className="text-xl md:text-3xl">{project.area} м²</h2>
              </div>
            )}

            {project.category && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm uppercase tracking-wider">
                  Category:
                </span>
                <span className="text-lg md:text-xl capitalize">
                  {project.category}
                </span>
              </div>
            )}
          </motion.div>

          {/* Project Title */}
          {projectTitle && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <h1 className="text-3xl md:text-5xl font-light">
                {projectTitle}
              </h1>
            </motion.div>
          )}

          {/* Project Description */}
          {projectDescription && (
            <motion.div
              className="w-full md:w-10/12 mx-auto mt-10 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            >
              <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                {projectDescription}
              </p>
            </motion.div>
          )}

          {/* Gallery Section */}
          {project.images && project.images.length > 1 && (
            <div className="mt-20">
              {Array.from(
                { length: Math.ceil((project.images.length - 1) / 6) },
                (_, i) => {
                  const startIdx = i * 6 + 1;
                  const endIdx = Math.min(startIdx + 6, project.images.length);
                  const galleryImages = project.images.slice(startIdx, endIdx);
                  const baseIndex = startIdx;

                  return (
                    <div key={i} className={i > 0 ? "mt-10" : ""}>
                      <GalleryLayout
                        images={galleryImages}
                        startDelay={0.1 * i}
                        onImageClick={(index) =>
                          handleImageFocus(index, baseIndex)
                        }
                      />
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Back Button */}
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link
              href="/projects"
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-md"
            >
              Back to Projects
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Image Focus Modal */}
      {focusedImageIndex !== null && project && project.images && (
        <ImageFocus
          images={getAllImages()}
          currentIndex={focusedImageIndex}
          onClose={closeFocusedImage}
          onNavigate={handleImageNavigation}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
