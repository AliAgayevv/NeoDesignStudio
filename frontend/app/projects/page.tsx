"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import LoadingAnimation from "@/components/LoadingAnimation";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфолио",
  az: "Portfel",
};

const RenderImage = ({ project, aspectRatio }: any) => {
  return (
    <div className={`relative w-full overflow-hidden group ${aspectRatio}`}>
      <Image
        src={`https://neodesignstudio.onrender.com${project.images[0]}`}
        alt={project.projectId}
        width={648}
        height={543}
        decoding="async"
        priority
        className="object-cover rounded-2xl w-full h-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
        {/* <h3 className="text-white text-xl font-medium">{project.title}</h3> */}
      </div>
    </div>
  );
};

const RenderImageGrid = ({ items }: any) => {
  // First 7 items with specific layout
  const firstSevenItems = items.slice(0, 7);

  console.log(firstSevenItems);

  // PRODUCTION:  /_next/image?url=https%3A%2F%2Fneodesignstudio.onrender.com%2Fuploads%2F1741621366058_WhatsApp%20Image%202025-03-09%20at%2022.55.06.jpeg&w=1920&q=75
  // LOCAL:       /_next/image?url=https%3A%2F%2Fneodesignstudio.onrender.com%2Fuploads%2F1741621366058_WhatsApp%20Image%202025-03-09%20at%2022.55.06.jpeg&w=1920&q=75
  // Grid layout configurations based on your requirements
  const gridConfig = [
    { width: "w-1/2", aspectRatio: "aspect-[1/1]" }, // 1. Half width, 1 height
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" }, // 2. Half width, 1.5 height
    {
      width: "w-1/2",
      aspectRatio:
        "aspect-[1/1.5] mt-[-90px] md:mt-[-10em] lg:mt-[-10em] xl:mt-[-15em] 2xl:mt-[-20em]",
    }, // 3. Half width, 1.5 height
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" }, // 4. Half width, 1 height
    { width: "w-full", aspectRatio: "aspect-[2/1]" }, // 5. Full width, 1 height
    { width: "w-1/2", aspectRatio: "aspect-[1/1]" }, // 6. Half width, 1 height
    { width: "w-1/2", aspectRatio: "aspect-[1/1.5]" }, // 7. Half width, 1.5 height
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[0]}
          aspectRatio={gridConfig[0].aspectRatio}
        />
      </div>
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[1]}
          aspectRatio={gridConfig[1].aspectRatio}
        />
      </div>
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[2]}
          aspectRatio={gridConfig[2].aspectRatio}
        />
      </div>
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[3]}
          aspectRatio={gridConfig[3].aspectRatio}
        />
      </div>
      <div className="col-span-2">
        <RenderImage
          project={firstSevenItems[4]}
          aspectRatio={gridConfig[4].aspectRatio}
        />
      </div>
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[5]}
          aspectRatio={gridConfig[5].aspectRatio}
        />
      </div>
      <div className="col-span-1">
        <RenderImage
          project={firstSevenItems[6]}
          aspectRatio={gridConfig[6].aspectRatio}
        />
      </div>
    </div>
  );
};

const Page = () => {
  const { data, isLoading, error } = useGetAllWorksQuery();
  const lang = useSelector(selectLanguage);

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

  // Ensure we have enough data to display
  const safeData = data || [];
  const displayData =
    safeData.length >= 7
      ? safeData
      : [
          ...safeData,
          ...Array(7 - safeData.length).fill({
            projectId: "placeholder",
            title: "Placeholder Project",
            images: ["/placeholder-image.jpg"],
          }),
        ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-11/12 mx-auto pb-24">
        <div className="pt-40">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>

        <div className="pt-20">
          <RenderImageGrid items={displayData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
