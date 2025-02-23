"use client";

import Image from "next/image";
import landingPhoto from "@/public/assets/photos/landingPhoto.png";
// import { useGetPageQuery } from "@/store/services/pageApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import { heroContent } from "@/data/mockDatas";

import { Playfair_Display } from "next/font/google";

import { socialMedias } from "@/data/mockDatas";
import NavigationButton from "./NavigationButton";

// type PageContent = {
//   mainTitle?: string;
// };

// type PageResponse = {
//   content: Partial<Record<"en" | "az" | "ru", PageContent>>;
// };

const playfairDisplayFont600 = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
});

const HeroSection = () => {
  const lang = useSelector(selectLanguage);
  // const { data, isLoading, error } = useGetPageQuery({
  //   page: "hero",
  //   lang,
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Failed to load data</p>;

  return (
    <section className="relative z-0 h-full md:h-[100vh] w-full bg-black md:bg-none">
      <Image
        src={landingPhoto}
        alt="Exterior Photo"
        className="hidden md:flex w-full h-full object-cover"
      />
      {/* <video src={exampleLandingVideo}></video> */}
      <div className="rounded-3xl md:hidden flex  w-[90%] mx-auto h-auto object-cover pt-28 relative">
        <video
          autoPlay
          loop
          muted
          className="rounded-3xl"
          // NAVIGATION BUTTON FALAN HAMSIN TELEFONA UYUMLU
        >
          <source src="/assets/exampleLandingVideo.mp4" type="video/mp4" />
        </video>
      </div>

      <h1
        className={`text-black md:text-white text-xl md:text-4xl font-bold text-center absolute top-32 right-10  md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${playfairDisplayFont600.className}`}
      >
        {heroContent[lang].mainTitle}
      </h1>
      <div className="  absolute -translate-y-16 left-12 md:translate-y-0 md:bottom-28 md:left-8  z-10 w-40">
        <NavigationButton
          backgroundColor="#9C9C9C"
          textBackgroundColor="#646060"
        >
          Get a quote
        </NavigationButton>
      </div>
      {/* Social media links */}
      <div className="hidden md:flex absolute bottom-8 left-8  gap-4 z-10">
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
