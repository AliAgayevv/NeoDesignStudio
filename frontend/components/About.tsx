"use client";

import React from "react";
import Image from "next/image";
import aboutUsPhoto from "../public/assets/photos/aboutUsPhoto.jpeg";
import SectionHeaderTitle from "./SectionHeaderTitle";
import { Playfair } from "next/font/google";

import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";

const headearTitle = {
  en: "About",
  az: "Haqqımızda",
  ru: "О нас",
};

const playfairDisplayFont600 = Playfair({
  subsets: ["latin"],
  weight: "600",
});

const About = () => {
  const lang = useSelector(selectLanguage);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = React.useState(false);
  return (
    <div
      id="about"
      className={`mx-auto mt-6 h-screen w-11/12 md:mt-32 ${
        isLearnMoreOpen ? "mb-40 md:mb-0" : "mb-0 md:mb-0"
      }`}
    >
      <SectionHeaderTitle>{headearTitle[lang]}</SectionHeaderTitle>
      <div
        className={` ${playfairDisplayFont600.className} mt-6 flex w-full flex-col-reverse justify-between gap-8 tracking-wide md:flex-row`}
      >
        <div className="flex flex-col gap-5 text-xl text-light_gray md:w-2/3">
          <h2 className="text-3xl font-semibold">How we can help</h2>
          <p className="text-right text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Assumenda
            dolorem, at obcaecati modi fugiat itaque ad odit quidem porro!
            Officiis reiciendis exercitationem minima, quas cumque consequatur
            at nisi sit omnis.
          </p>
          {isLearnMoreOpen && (
            <div>
              <p className="w-3/4 text-left text-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Assumenda dolorem, at obcaecati modi fugiat itaque ad odit
                quidem porro! Officiis reiciendis exercitationem minima, quas
                cumque consequatur at nisi sit omnis.
              </p>
            </div>
          )}
          <p
            className="cursor-pointer self-end font-bold underline"
            onClick={() => setIsLearnMoreOpen((prev) => !prev)}
          >
            Learn More
          </p>
        </div>
        <div className="relative w-full md:w-1/2 md:overflow-visible">
          <div className="absolute bottom-6 left-8 z-0 h-full w-full -translate-x-6 rounded-lg border border-[#955C22] shadow-md md:bottom-12 md:left-10 md:-translate-x-4" />

          <Image
            alt="Learn More Image"
            src={aboutUsPhoto}
            className="relative z-10 h-auto w-full rounded-lg object-cover shadow-lg md:min-h-[600px]"
            // object-cover rounded-lg shadow-lg md:min-h-[600px] h-auto w-full
          />
        </div>
      </div>
    </div>
  );
};

export default About;
