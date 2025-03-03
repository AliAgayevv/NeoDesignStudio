"use client";

import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import React from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import Image from "next/image";
import project1 from "@/public/projectsPhotos/project1.jpeg";
import project2 from "@/public/projectsPhotos/project2.jpeg";
import project3 from "@/public/projectsPhotos/project3.jpeg";
import project4 from "@/public/projectsPhotos/project4.jpeg";
import project5 from "@/public/projectsPhotos/project5.png";
import project6 from "@/public/projectsPhotos/project6.jpeg";
import project7 from "@/public/projectsPhotos/project7.jpeg";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфол",
  az: "Portfel",
};

const images = [
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  project7,
];

const Page = () => {
  const lang = useSelector(selectLanguage);
  return (
    <div className="w-screen h-[99999px] bg-black relative z-0 text-white text-7xl">
      <div className="w-11/12 mx-auto">
        <div className="pt-48">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>
      </div>
    </div>
  );
};

export default Page;
