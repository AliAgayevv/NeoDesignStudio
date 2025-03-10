"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import LoadingAnimation from "@/components/LoadingAnimation";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import areaSVG from "../../public/assets/icons/areaSVG.svg";
import Link from "next/link";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфолио",
  az: "Portfel",
};

let isFirstTour = true;

const RenderImage = ({
  project,
  aspectRatio,
}: {
  project: any;
  aspectRatio: string;
}) => {
  console.log(project);
  const language = useSelector(selectLanguage);

  // If no project is provided, don't render anything
  if (!project) {
    return null;
  }

  return (
    <Link href={`/projects/${project.projectId}`}>
      <div className={`relative w-full overflow-hidden group ${aspectRatio}`}>
        {/* Main image with blur effect on hover */}
        <Image
          src={`https://neodesignstudio.onrender.com${project.images[0]}`}
          alt={project.projectId}
          width={648}
          height={543}
          decoding="async"
          priority
          className="object-cover rounded-[12px] md:rounded-[50px] md:group-hover:rounded-[50px] w-full h-full transition-all duration-500 md:group-hover:scale-105 md:group-hover:blur-sm"
        />

        {/* Content overlay that appears on hover */}
        <div className="hidden md:flex absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[50px]  flex-col items-center justify-center">
          <h3 className="text-white text-3xl font-light uppercase tracking-wider mb-8 drop-shadow-lg">
            {project.title[language]}
          </h3>

          <div className="flex items-center justify-center gap-8 text-white">
            <div className="flex items-center">
              <div className="mr-2">
                <Image src={areaSVG} alt="area" width={24} height={24} />
              </div>
              <span className="text-xl drop-shadow-lg">{project.area} м²</span>
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
              <span className="text-xl drop-shadow-lg">
                {project.location[language]}
              </span>
            </div>
          </div>
        </div>
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

const Page = () => {
  const { data, isLoading, error } = useGetAllWorksQuery();
  const lang = useSelector(selectLanguage);
  const [visibleGroups, setVisibleGroups] = useState(1);
  const observerTarget = useRef(null);

  // Get project groups
  const projectGroups = data
    ? prepareProjectGroups(
        data.map((project) => ({ ...project, area: Number(project.area) })),
      )
    : [];

  // Set up infinite scroll
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

        <div className="pt-20">
          {projectGroups.slice(0, visibleGroups).map((group, index) => (
            <RenderImageGrid
              key={`group-${index}`}
              items={group}
              index={index}
            />
          ))}

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
