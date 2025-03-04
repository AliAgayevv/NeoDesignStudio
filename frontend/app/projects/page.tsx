"use client";

import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import React from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import images1 from "@/public/projectsPhotos/project1.jpeg";
import images2 from "@/public/projectsPhotos/project2.jpeg";
import images3 from "@/public/projectsPhotos/project3.jpeg";
import images4 from "@/public/projectsPhotos/project4.jpeg";
import images5 from "@/public/projectsPhotos/project5.png";
import images6 from "@/public/projectsPhotos/project6.jpeg";
import images7 from "@/public/projectsPhotos/project7.jpeg";
import Image from "next/image";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфол",
  az: "Portfel",
};

interface IRender7ImagesProps {
  images: any[];
}

const images = [images1, images2, images3, images4, images5, images6, images7];

const Render7Images: React.FC<IRender7ImagesProps> = ({ images }) => {
  let count = 0;
  return (
    <div>
      {count === 6 ? (
        <Render7Images images={images.slice(count, count + 6)} />
      ) : (
        images.map((image) => {
          count++;
          return (
            <div key={count} className="w-full h-[400px] bg-black">
              <Image
                src={image}
                alt="project"
                className="w-full h-full object-cover relative"
              />
              <div className="inset-0 absolute top-1/2 left-1/2">
                <h1 className="text-black text-5xl">Project {count}</h1>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const Page = () => {
  const lang = useSelector(selectLanguage);
  return (
    <div className="w-screen h-[99999px] bg-black relative z-0 text-white text-7xl">
      <div className="w-11/12 mx-auto">
        <div className="pt-48">
          <SectionHeaderTitle>{headerTitle[lang]}</SectionHeaderTitle>
        </div>
      </div>
      <Render7Images images={images} />
    </div>
  );
};

export default Page;
