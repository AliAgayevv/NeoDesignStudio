"use client";

import SectionHeaderTitle from "@/components/SectionHeaderTitle";
import React from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";

const headerTitle = {
  en: "Portfolio",
  ru: "Портфол",
  az: "Portfel",
};

const page = () => {
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

export default page;
