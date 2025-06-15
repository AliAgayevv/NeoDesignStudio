"use client";

import Image from "next/image";
import landingPhoto from "@/public/assets/photos/landingPhoto.png";
import { useGetPageQuery } from "@/store/services/pageApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
// import { heroContent } from "@/data/mockDatas";

import { Playfair_Display } from "next/font/google";

import { socialMedias } from "@/data/mockDatas";
import NavigationButton from "./NavigationButton";
import { handleGoSomewhere } from "@/utils/handleGoSomewhere";

// type PageContent = {
//   mainTitle?: string;
// };

// type PageResponse = {
//   content: Partial<Record<"en" | "az" | "ru", PageContent>>;
// };

const navigationButtonInner = {
  en: "Get a quote",
  az: "Təklif alın",
  ru: "Получить предложение",
};

const playfairDisplayFont600 = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
});

const HeroSection = () => {
  const lang = useSelector(selectLanguage);

  const { data, isLoading, error } = useGetPageQuery({
    page: "hero",
    lang,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data</p>;

  return (
    <section className="relative z-0 h-full w-full bg-black md:h-[100vh] md:bg-none">
      <Image
        src={landingPhoto}
        alt="Exterior Photo"
        className="hidden h-full w-full object-cover md:flex"
      />
      {/* <video src={exampleLandingVideo}></video> */}
      <div className="relative mx-auto flex h-auto w-[90%] rounded-3xl object-cover pt-28 md:hidden">
        <video
          playsInline
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
        className={`absolute right-[10%] w-3/4 top-32 text-right text-xl font-bold text-black md:left-1/2 md:top-1/2  md:-translate-x-1/2 md:-translate-y-1/2 md:text-center md:text-4xl md:text-white ${playfairDisplayFont600.className}`}
      >
        {data?.content?.mainTitle}
      </h1>
      <div
        className="absolute left-12 z-10 w-60 -translate-y-16 md:bottom-28 md:left-8 md:translate-y-0"
        onClick={() => handleGoSomewhere("contact")}
      >
        <NavigationButton
          backgroundColor="#9C9C9C"
          textBackgroundColor="#646060"
        >
          {navigationButtonInner[lang]}
        </NavigationButton>
      </div>
      {/* Social media links */}
      <div className="absolute bottom-8 left-8 z-10 hidden gap-4 md:flex">
        {socialMedias.map((socialMedia) => (
          <a
            target="_blank"
            href={socialMedia.url}
            key={socialMedia.name}
            className="text-white bg-none md:hover:text-deep_brown md:hover:bg-white rounded-full"
          >
            <div className="p-1">{socialMedia.icon}</div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
