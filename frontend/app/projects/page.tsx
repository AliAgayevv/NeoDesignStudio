"use client";
import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import React from "react";
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
const BACKEND_URL = "https://neodesignstudio.onrender.com";

const Page = () => {
  const lang = useSelector(selectLanguage);
  const { data, isLoading, error } = useGetAllWorksQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data</p>;

  console.log("Portfolio data:", data); // Add this to debug

  return (
    <div className="w-screen h-auto min-h-screen bg-black relative z-0 text-white">
      <div className="w-11/12 mx-auto">
        <div className="pt-48">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>
        <div className="py-12">
          {data?.map((work) => (
            <div
              key={work.projectId}
              className="w-full h-[400px] relative my-8 rounded-lg overflow-hidden"
            >
              {work.images && work.images.length > 0 && (
                <Image
                  src={`${BACKEND_URL}/${work.images[0]}`}
                  width={1920}
                  height={1080}
                  alt={work.content[lang]?.title || "Project image"}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl mb-4">{work.content[lang]?.title}</h1>
                <p className="text-xl text-center max-w-3xl">
                  {work.content[lang]?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
