"use client";

import Image from "next/image";
import landingPhoto from "@/public/assets/photos/landingPhoto.png";
import { useGetPageQuery } from "@/store/services/pageApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import { heroContent } from "@/data/mockDatas";

import { socialMedias } from "@/data/mockDatas";

type PageContent = {
  mainTitle?: string;
};

type PageResponse = {
  content: Partial<Record<"en" | "az" | "ru", PageContent>>;
};

const HeroSection = () => {
  const lang = useSelector(selectLanguage);
  // const { data, isLoading, error } = useGetPageQuery({
  //   page: "hero",
  //   lang,
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Failed to load data</p>;

  return (
    <section className="relative z-0">
      <Image
        src={landingPhoto}
        alt="Exterior Photo"
        className="hidden md:flex w-full h-full object-cover"
      />
      <h1 className="text-white text-4xl font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {heroContent[lang].mainTitle}
      </h1>

      {/* Social media links */}
      <div className="absolute bottom-8 left-8 flex gap-4 z-10">
        {socialMedias.map((socialMedia) => (
          <a
            target="_blank"
            href={socialMedia.url}
            key={socialMedia.name}
            className="text-white"
          >
            {socialMedia.icon}
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
