"use client";
import Image from "next/image";
import { useGetPageQuery } from "@/store/services/pageApi";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import photo1 from "@/public/assets/photos/test1.jpeg";
import photo2 from "@/public/assets/photos/test2.jpeg";
import photo3 from "@/public/assets/photos/test3.jpeg";
import photo4 from "@/public/assets/photos/test4.jpeg";
import photo5 from "@/public/assets/photos/test5.jpeg";
import { Playfair_Display } from "next/font/google";
import { socialMedias } from "@/data/mockDatas";
import NavigationButton from "./NavigationButton";
import { handleGoSomewhere } from "@/utils/handleGoSomewhere";
import { useState, useEffect } from "react";

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

  // Slider için fotoğraf dizisi
  const sliderPhotos = [photo1, photo2, photo3, photo4, photo5];
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Otomatik slider efekti
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex === sliderPhotos.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000); // 4 saniyede bir değişir

    return () => clearInterval(interval);
  }, [sliderPhotos.length]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data</p>;

  return (
    <section className="relative z-0 h-full w-full bg-black md:h-[100vh]">
      {/* Desktop için slider */}
      <div className="hidden md:block relative h-full w-full overflow-hidden">
        {sliderPhotos.map((photo, index) => (
          <Image
            key={index}
            src={photo}
            alt={`Slider Photo ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === currentPhotoIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Mobile için slider */}
      <div className="block md:hidden relative mx-auto w-[90%] h-[300px] rounded-3xl overflow-hidden mt-20">
        {sliderPhotos.map((photo, index) => (
          <Image
            key={index}
            src={photo}
            alt={`Mobile Slider Photo ${index + 1}`}
            fill
            className={`object-cover rounded-3xl transition-opacity duration-1000 ${
              index === currentPhotoIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <h1
        className={`absolute right-[10%] w-3/4 top-32  text-right text-2xl font-bold text-soft_white md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:text-center md:text-5xl md:text-white ${playfairDisplayFont600.className}
          `}
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
