"use client";
import React, { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { Montserrat } from "next/font/google";
import areaSVG from "../public/assets/icons/areaSVG.svg";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import { selectCategory, setCategory } from "@/store/services/categorySlice";

import LoadingAnimation from "@/components/LoadingAnimation";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";

import projectsBG from "@/public/assets/projectsBg.svg";

const montserrat700 = Montserrat({
  subsets: ["latin"],
  weight: "700",
});

const headerTitle = {
  en: "Portfolio",
  ru: "Портфолио",
  az: "Portfel",
};

const categoryLabels = {
  en: {
    all: "All",
    interior: "Interior",
    exterior: "Exterior",
    business: "Business",
  },
  ru: {
    all: "Все",
    interior: "Интерьер",
    exterior: "Экстерьер",
    business: "Бизнес",
  },
  az: {
    all: "Hamısı",
    interior: "Interyer",
    exterior: "Eksteryer",
    business: "Biznes",
  },
};

const cormarantGaramondFont700 = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "700",
});

const baseURLTEMP = "http://45.85.146.73:4000";

const RenderImage = ({
  project,
  aspectRatio,
  index,
  itemIndex = 0,
}: {
  project: any;
  aspectRatio: string;
  index: number;
  itemIndex?: number;
}) => {
  const language = useSelector(selectLanguage);

  // If no project is provided, don't render anything
  if (!project) {
    return null;
  }

  console.log("Project Image:", baseURLTEMP + project.images[0]);

  return (
    <Link href={`/projects/${project.projectId}`}>
      <div className={`relative w-full overflow-hidden group ${aspectRatio}`}>
        {/* Main image with improved blur effect on hover */}
        <div className="w-full h-full">
          <Image
            src={
              project.images[0]?.startsWith("/") ||
              project.images[0]?.startsWith("http")
                ? baseURLTEMP + project.images[0]
                : `${baseURLTEMP}/uploads/${project.images[0]}`
            }
            alt={project.projectId || "Project image"}
            width={800}
            height={600}
            quality={80}
            priority={index === 0 && itemIndex < 2}
            loading={index === 0 && itemIndex < 2 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExMTExIi8+PC9zdmc+"
            className="object-cover rounded-[12px] md:rounded-[50px] transition-all duration-300 w-full h-full md:group-hover:blur-sm"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Subtle overlay gradient to enhance blur effect */}
          <div
            className="absolute inset-0 opacity-0 bg-black/20 rounded-[12px] md:rounded-[50px] 
                       md:group-hover:opacity-100 transition-all duration-500"
          ></div>
        </div>

        {/* Content overlay that appears on hover with improved visibility */}
        <div
          className={`hidden md:flex absolute inset-0 opacity-0 group-hover:opacity-100 
                     transition-all duration-500 rounded-[50px] flex-col items-center justify-center 
                     ${cormarantGaramondFont700.className} z-10`}
        >
          <h3
            className={`text-white text-5xl font-light uppercase tracking-wider mb-8 
                      drop-shadow-md transform transition-transform duration-500 
                      translate-y-4 group-hover:translate-y-0`}
          >
            {project.title[language]}
          </h3>
          <div
            className="flex items-center justify-center gap-8 text-white 
                      transform transition-transform duration-500 
                      translate-y-4 group-hover:translate-y-0"
          >
            <div className="flex items-center">
              <div className="mr-2">
                <Image src={areaSVG} alt="area" width={32} height={32} />
              </div>
              <span className="text-3xl drop-shadow-lg">{project.area} м²</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2">
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
              </div>
              <span className="text-3xl drop-shadow-lg">
                {project.location[language]}
              </span>
            </div>
          </div>
        </div>

        {/* Category badge */}
      </div>
    </Link>
  );
};

const RenderImageGrid = ({ items, index }: ProjectGroup) => {
  // Grid layout configurations
  const isFirst = index === 0;

  const gridConfig = [
    {
      width: "w-1/2",
      aspectRatio: `aspect-[1/1] ${isFirst ? "mt-0" : "mt-[-150px] md:mt-[-14em] lg:mt-[-18em] xl:mt-[-20em]"}`,
    },
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" },
    {
      width: "w-1/2",
      aspectRatio: `aspect-[1/1.5] ${isFirst ? "mt-[-90px] md:mt-[-10em] lg:mt-[-10em] xl:mt-[-15em] 2xl:mt-[-20em]" : "mt-[-12em] md:mt-[-25em] lg:mt-[-30em] xl:mt-[-35em]"} `,
    },
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" },
    { width: "w-full", aspectRatio: "aspect-[2/1]" },
    { width: "w-1/2", aspectRatio: "aspect-[1/1]" },
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" },
  ];

  if (isFirst) {
    isFirstTour = false;
    console.log(isFirstTour);
  }

  // This will maintain the same exact layout but only render as many items as we have
  return (
    <div className="grid grid-cols-2 gap-6 mb-24">
      {/* First row */}
      {items.length > 0 && (
        <div className="col-span-1">
          <RenderImage
            project={items[0]}
            aspectRatio={gridConfig[0].aspectRatio}
            index={index}
            itemIndex={0}
          />
        </div>
      )}
      {items.length > 1 && (
        <div className="col-span-1">
          <RenderImage
            project={items[1]}
            aspectRatio={gridConfig[1].aspectRatio}
            index={index}
            itemIndex={1}
          />
        </div>
      )}

      {/* Second row with offset */}
      {items.length > 2 && (
        <div className="col-span-1">
          <RenderImage
            project={items[2]}
            aspectRatio={gridConfig[2].aspectRatio}
            index={index}
            itemIndex={2}
          />
        </div>
      )}
      {items.length > 3 && (
        <div className="col-span-1">
          <RenderImage
            project={items[3]}
            aspectRatio={gridConfig[3].aspectRatio}
            index={index}
            itemIndex={3}
          />
        </div>
      )}

      {/* Full width item */}
      {items.length > 4 && (
        <div className="col-span-2">
          <RenderImage
            project={items[4]}
            aspectRatio={gridConfig[4].aspectRatio}
            index={index}
            itemIndex={4}
          />
        </div>
      )}

      {/* Last row */}
      {items.length > 5 && (
        <div className="col-span-1">
          <RenderImage
            project={items[5]}
            aspectRatio={gridConfig[5].aspectRatio}
            index={index}
            itemIndex={5}
          />
        </div>
      )}
      {items.length > 6 && (
        <div className="col-span-1">
          <RenderImage
            project={items[6]}
            aspectRatio={gridConfig[6].aspectRatio}
            index={index}
            itemIndex={6}
          />
        </div>
      )}
    </div>
  );
};

interface Project {
  projectId: string;
  images: string[];
  title: { [key: string]: string };
  area: number;
  location: { [key: string]: string };
  category?: string;
}

interface ProjectGroup {
  items: Project[];
  index: number;
}
const prepareProjectGroups = (projects: Project[]): Project[][] => {
  if (!projects || projects.length === 0) return [];

  const groups: Project[][] = [];
  const itemsPerGroup = 7;

  // Calculate how many complete groups we can make
  const completeGroups = Math.floor(projects.length / itemsPerGroup);

  // Add complete groups
  for (let i = 0; i < completeGroups; i++) {
    const startIndex = i * itemsPerGroup;
    groups.push(projects.slice(startIndex, startIndex + itemsPerGroup));
  }

  // Add remaining items as a partial group if any exist
  const remainingItems = projects.length % itemsPerGroup;
  if (remainingItems > 0) {
    const startIndex = completeGroups * itemsPerGroup;
    groups.push(projects.slice(startIndex));
  }

  return groups;
};

type CategoryType = "all" | "interior" | "exterior" | "business";

// Category labels type
type CategoryLabels = {
  [lang: string]: {
    [category in CategoryType]: string;
  };
};

// Props interface for the component
interface CategoryFilterProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  lang: string;
  categoryLabels: CategoryLabels;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  setActiveCategory,
  lang,
  categoryLabels,
}) => {
  const categories: CategoryType[] = [
    "all",
    "interior",
    "exterior",
    "business",
  ];

  return (
    <div className="w-full mt-8 mb-8 overflow-hidden">
      <div className="ml-3 md:ml-3 flex space-x-5 md:space-x-16 relative">
        {categories.map((category) => (
          <div
            key={category}
            className="relative cursor-pointer"
            onClick={() => setActiveCategory(category)}
          >
            {/* White underline only for active category */}
            {activeCategory === category && (
              <motion.div
                className={` absolute h-0.5 bg-white  bottom-0 ${activeCategory === "all" ? "-left-1 w-10" : "w-full"}`}
                layoutId="activeUnderline"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}

            <motion.button
              className={`text-md md:text-xl font-semibold pb-2 text-off_white ${montserrat700.className}`}
              whileTap={{ scale: 0.95 }}
              aria-pressed={activeCategory === category}
              aria-label={`Filter by ${category}`}
            >
              {categoryLabels[lang]?.[category] ||
                category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Type for project categories
type categoryTypes = "all" | "interior" | "exterior" | "business";

let isFirstTour = true;

// ProjectsComponent içindeki değiştirilmesi gereken kısımlar:

const ProjectsComponent = () => {
  const { data: apiResponse, isLoading, error } = useGetAllWorksQuery();
  const lang = useSelector(selectLanguage);
  const [visibleGroups, setVisibleGroups] = useState(1);
  const dispatch = useDispatch();

  const activeCategory = useSelector(selectCategory);
  const observerTarget = useRef(null);

  const handleCategoryChange = (category: categoryTypes) => {
    dispatch(setCategory(category));
  };

  // Backend'den gelen data yapısını handle et
  // Backend artık { success: true, data: [...], message: "..." } formatında döndürüyor
  const data = apiResponse?.data || apiResponse || [];

  console.log("API Response:", apiResponse);
  console.log("Extracted Data:", data);

  // Filter projects by category
  const filteredData = Array.isArray(data)
    ? activeCategory === "all"
      ? data
      : data.filter((project) => project.category === activeCategory)
    : [];

  console.log("Filtered Data:", filteredData);

  // Get project groups
  const projectGroups = Array.isArray(filteredData)
    ? prepareProjectGroups(
        filteredData.map((project) => ({
          ...project,
          area: Number(project.area),
        })),
      )
    : [];

  // Reset visible groups when category changes
  useEffect(() => {
    setVisibleGroups(1);
  }, [activeCategory]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCategory = localStorage.getItem(
        "category",
      ) as CategoryType | null;
      if (
        savedCategory &&
        ["all", "interior", "exterior", "business"].includes(savedCategory)
      ) {
        dispatch(setCategory(savedCategory as CategoryType));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleGroups < projectGroups.length) {
          setVisibleGroups((prev) => Math.min(prev + 1, projectGroups.length));
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [projectGroups.length, visibleGroups]);

  // Error handling'i iyileştir
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="w-11/12 mx-auto pt-32 text-left">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("API Error:", error);
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="w-11/12 mx-auto pt-32 text-left">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
          <div className="text-center mt-8">
            <p className="text-xl mb-4">
              Failed to load projects. Please try again later.
            </p>
            <p className="text-sm text-gray-400">
              Error: {error?.message || "Unknown error occurred"}
            </p>
            <button
              className="mt-4 bg-deep_brown px-6 py-2 rounded-full hover:bg-deep_brown/80 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Data yoksa veya boşsa
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="w-11/12 mx-auto pt-32 text-left">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
          <div className="text-center mt-8">
            <p className="text-xl mb-4">No projects found.</p>
            <p className="text-sm text-gray-400">
              There are currently no projects to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-11/12 mx-auto pb-24">
        <div className="pt-40">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          lang={lang}
          categoryLabels={categoryLabels}
        />

        <div className="mt-8 relative overflow-hidden">
          {/* Background image for the entire projects section */}
          <Image
            src={projectsBG}
            alt="Projects Background"
            className="w-full opacity-50 absolute top-0 left-0 h-full object-cover z-0"
            width={1920}
            height={1080}
            quality={70}
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4="
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {projectGroups.length > 0 ? (
                projectGroups
                  .slice(0, visibleGroups)
                  .map((group, index) => (
                    <RenderImageGrid
                      key={`group-${index}-${activeCategory}`}
                      items={group}
                      index={index}
                    />
                  ))
              ) : (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xl">{`No ${activeCategory} projects found.`}</p>
                  <button
                    className="mt-4 bg-deep_brown px-6 py-2 rounded-full hover:bg-deep_brown/80 transition-colors"
                    onClick={() => handleCategoryChange("all")}
                  >
                    View all projects
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Loading indicator and observer target */}
          {visibleGroups < projectGroups.length && (
            <div
              ref={observerTarget}
              className="flex justify-center items-center py-10"
            >
              <LoadingAnimation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsComponent;
