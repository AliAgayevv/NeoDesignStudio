"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SectionHeaderTitle from "./SectionHeaderTitle";
import { servicesCardContent } from "@/data/mockDatas";
import ServicesCard from "./ServicesCard";
import { selectLanguage, setLanguage } from "@/store/services/languageSlice";

import Image from "next/image";
import imgExample from "@/public/assets/photos/aboutUsPhoto.jpeg";
import imgExample2 from "@/public/assets/photos/servicesExamplePhoto.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper/core";

import { Playfair_Display } from "next/font/google";

const playfairDisplayFont800 = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
});

const images = [
  {
    id: 1,
    img: imgExample,
    text: {
      az: "Interyer",
      en: "Interior",
      ru: "Интерьер",
    },
  },
  {
    id: 2,
    img: imgExample2,
    text: {
      az: "Eksterer",
      en: "Exterior",
      ru: "Экстерьер",
    },
  },
  {
    id: 3,
    img: imgExample,
    text: {
      az: "Biznes",
      en: "Business",
      ru: "Бизнес",
    },
  },
];

const Services = () => {
  SwiperCore.use([Pagination]);
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as
      | "en"
      | "az"
      | "ru";
    if (storedLanguage) {
      dispatch(setLanguage(storedLanguage));
    }
  }, [dispatch]);

  return (
    <section className="w-11/12 mx-auto h-[900000px]">
      <SectionHeaderTitle>Services</SectionHeaderTitle>
      <div className="hidden md:flex w-full justify-between items-center">
        {servicesCardContent.map(({ id, img, isReversed, text }) => (
          <ServicesCard
            key={id}
            img={img}
            isReversed={isReversed}
            text={text[language]}
          />
        ))}
      </div>
      <div className="block md:hidden w-full mx-auto">
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay, Pagination]}
          centeredSlides={true}
          className="rounded-lg overflow-hidden"
          pagination={{
            clickable: true,
          }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="h-[46vh]">
                <div className="relative w-full h-[40vh]">
                  <div
                    className={`absolute bottom-1/2 translate-y-10 left-10  z-40  ${playfairDisplayFont800.className} text-3xl tracking-widest`}
                  >
                    {src.text[language]}
                  </div>
                  <Image
                    src={src.img}
                    alt={`Slide ${index}`}
                    layout="fill"
                    className="rounded-3xl"
                    objectFit="cover"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Services;
