"use client";

import React from "react";
import Image from "next/image";
import aboutUsPhoto from "../public/assets/photos/aboutUsPhoto.jpeg";
import SectionHeaderTitle from "./SectionHeaderTitle";
import { Playfair } from "next/font/google";
import { motion } from "framer-motion";

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

const aboutUs = {
  az: "Biz 5 ildir fəaliyyət göstərən dizayn studiyasıyıq. 5 il ərzində 300-dən artıq uğurlu layihəmiz olub. Bütün Azərbaycanda və Birləşmiş Ərəb Əmirlikləri, Rusiya həmçinin də Türkiyədə layihələrimiz olub. Bizim komandamız, sizin mənzil və ya villanıza, müasir yanaşma ilə kreativ həll yolları təklif edir.",
  en: "We are a design studio that has been operating for 5 years. During these 5 years, we have completed more than 300 successful projects. We have had projects throughout Azerbaijan and in the United Arab Emirates, Russia, as well as Turkey. Our team offers creative solutions with a modern approach for your apartment or villa.",
  ru: "Мы дизайн-студия, которая работает уже 5 лет. За эти 5 лет у нас было более 300 успешных проектов. У нас были проекты по всему Азербайджану, а также в Объединённых Арабских Эмиратах, России и Турции. Наша команда предлагает креативные решения с современным подходом для вашей квартиры или виллы.",
};

const howWeCanHelp = {
  en: "How we can help",
  az: "Necə kömək edə bilərik",
  ru: "Как мы можем помочь",
};

const About = () => {
  const lang = useSelector(selectLanguage);

  return (
    <div
      id="about"
      className={`mx-auto mt-6 h-screen w-11/12 md:mt-32 mb-52 md:mb-20 lg:mb-40 xl:mb-20 2xl:mb-40
      }`}
    >
      <SectionHeaderTitle>{headearTitle[lang]}</SectionHeaderTitle>
      <div
        className={` ${playfairDisplayFont600.className} mt-6 flex w-full flex-col-reverse justify-between gap-8 tracking-wide md:flex-row`}
      >
        <div className="flex flex-col gap-5 text-xl text-light_gray md:w-2/3">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-3xl font-semibold"
          >
            {howWeCanHelp[lang]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 200 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-left ml-20  text-xl  md:text-2xl"
            style={{ lineHeight: "2.5rem" }}
          >
            {aboutUs[lang]}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative w-full md:w-1/2 md:overflow-visible"
        >
          <div className="absolute bottom-6 left-8 z-0 h-full w-full -translate-x-6 rounded-lg border border-[#955C22] shadow-md md:bottom-12 md:left-10 md:-translate-x-4" />

          <Image
            alt="Learn More Image"
            src={aboutUsPhoto}
            className="relative z-10 h-auto w-full rounded-lg object-cover shadow-lg md:min-h-[600px]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;
