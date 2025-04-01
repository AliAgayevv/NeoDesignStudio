"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import LoadingAnimation from "@/components/LoadingAnimation";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import areaSVG from "../../public/assets/icons/areaSVG.svg";
import Link from "next/link";
import projectsBG from "@/public/assets/projectsBg.svg";
import { Cormorant_Garamond } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { selectCategory, setCategory } from "@/store/services/categorySlice";

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

let isFirstTour = true;

const RenderImage = ({
  project,
  aspectRatio,
}: {
  project: any;
  aspectRatio: string;
}) => {
  const language = useSelector(selectLanguage);

  // If no project is provided, don't render anything
  if (!project) {
    return null;
  }

  return (
    <Link href={`/projects/${project.projectId}`}>
      <div className={`relative w-full overflow-hidden group ${aspectRatio}`}>
        {/* Main image with improved blur effect on hover */}
        <div className="w-full h-full">
          <Image
            src={`http://45.85.146.73:4000${project.images[0]}`}
            alt={project.projectId}
            width={648}
            height={543}
            decoding="async"
            priority
            className="object-cover rounded-[12px] md:rounded-[50px] transition-all duration-300 w-full h-full md:group-hover:blur-sm "
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
  console.log(isFirstTour);

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
          />
        </div>
      )}
      {items.length > 1 && (
        <div className="col-span-1">
          <RenderImage
            project={items[1]}
            aspectRatio={gridConfig[1].aspectRatio}
          />
        </div>
      )}

      {/* Second row with offset */}
      {items.length > 2 && (
        <div className="col-span-1">
          <RenderImage
            project={items[2]}
            aspectRatio={gridConfig[2].aspectRatio}
          />
        </div>
      )}
      {items.length > 3 && (
        <div className="col-span-1">
          <RenderImage
            project={items[3]}
            aspectRatio={gridConfig[3].aspectRatio}
          />
        </div>
      )}

      {/* Full width item */}
      {items.length > 4 && (
        <div className="col-span-2">
          <RenderImage
            project={items[4]}
            aspectRatio={gridConfig[4].aspectRatio}
          />
        </div>
      )}

      {/* Last row */}
      {items.length > 5 && (
        <div className="col-span-1">
          <RenderImage
            project={items[5]}
            aspectRatio={gridConfig[5].aspectRatio}
          />
        </div>
      )}
      {items.length > 6 && (
        <div className="col-span-1">
          <RenderImage
            project={items[6]}
            aspectRatio={gridConfig[6].aspectRatio}
          />
        </div>
      )}
    </div>
  );
};

// Prepare projects for grid display
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

type CategoryLabels = {
  [lang: string]: {
    [category: string]: string;
  };
};

// Define allowed categories
type CategoryType = "all" | "interior" | "exterior" | "business";

// Props interface for the component
interface CategoryFilterProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  lang: string;
  categoryLabels: CategoryLabels;
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
    <motion.div
      className="flex justify-center w-full overflow-x-auto py-2 md:justify-start mt-4 md:mt-8 mb-6 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-deep_brown rounded-full p-1 md:p-2 flex items-center min-w-fit mx-auto md:mx-0">
        {categories.map((category) => (
          <div
            key={category}
            className="relative mx-0.5 md:mx-1 px-0.5 md:px-1"
            onClick={() => setActiveCategory(category)}
          >
            {activeCategory === category && (
              <motion.div
                className="absolute inset-0 bg-soft_white rounded-full"
                layoutId="activeCategoryBackground"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <motion.button
              className={`relative z-10 px-2 py-1.5 md:px-4 md:py-2 rounded-full font-medium text-sm md:text-lg whitespace-nowrap transition-colors ${
                activeCategory === category ? "text-black" : "text-white"
              }`}
              whileHover={{ scale: activeCategory !== category ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={activeCategory === category}
              aria-label={`Filter by ${category}`}
            >
              {categoryLabels[lang]?.[category] || category}
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Type for project categories
type categoryTypes = "all" | "interior" | "exterior" | "business";

const Page = () => {
  const { data, isLoading, error } = useGetAllWorksQuery();
  const lang = useSelector(selectLanguage);
  const [visibleGroups, setVisibleGroups] = useState(1);
  const dispatch = useDispatch();

  const activeCategory = useSelector(selectCategory);

  const observerTarget = useRef(null);

  const handleCategoryChange = (category: categoryTypes) => {
    dispatch(setCategory(category));
  };

  // Filter projects by category
  const filteredData = data
    ? activeCategory === "all"
      ? data
      : data.filter((project) => project.category === activeCategory)
    : [];

  // Get project groups
  const projectGroups = filteredData
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

  // Set up infinite scroll

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
          // Load more groups when we reach the bottom
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
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="w-11/12 mx-auto pt-32 text-left">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
          <p className="text-xl mt-8">
            Failed to load projects. Please try again later.
          </p>
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
                      key={`group-${index}`}
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

export default Page;
