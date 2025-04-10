"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SectionHeaderTitle from "./SectionHeaderTitle";
import ServicesCard from "./ServicesCard";
import { selectLanguage, setLanguage } from "@/store/services/languageSlice";
import imgExample from "@/public/assets/photos/aboutUsPhoto.jpeg";
import imgExample2 from "@/public/assets/photos/servicesExamplePhoto.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper/core";
import { Playfair_Display } from "next/font/google";
import { setCategory } from "@/store/services/categorySlice";
import { useGetWorkByCategoryQuery } from "@/store/services/workApi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const playfairDisplayFont800 = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
});

const headerTitle = {
  az: "Xidmətlər",
  en: "Services",
  ru: "Услуги",
};

// Define categories and their translations
const categoryInfo = {
  interior: {
    id: 1,
    isReversed: false,
    text: {
      en: "Interior",
      az: "Interyer",
      ru: "Интерьер",
    },
  },
  exterior: {
    id: 2,
    isReversed: true,
    text: {
      en: "Exterior",
      az: "Eksterer",
      ru: "Экстерьер",
    },
  },
  business: {
    id: 3,
    isReversed: false,
    text: {
      en: "Business",
      az: "Biznes",
      ru: "Бизнес",
    },
  },
};

const Services = () => {
  SwiperCore.use([Pagination]);
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();
  const router = useRouter();
  // const category = useSelector(selectCategory);

  // Fetch project data for each category
  const { data: interiorData } = useGetWorkByCategoryQuery({
    category: "interior",
  });

  const { data: exteriorData } = useGetWorkByCategoryQuery({
    category: "exterior",
  });

  const { data: businessData } = useGetWorkByCategoryQuery({
    category: "business",
  });

  const serviceCards = [
    {
      ...categoryInfo.interior,
      img:
        interiorData &&
        interiorData.length > 0 &&
        interiorData[0]?.images?.length > 0
          ? `${interiorData[0].images[0]}`
          : imgExample,
      category: "interior",
    },
    {
      ...categoryInfo.exterior,
      img:
        exteriorData &&
        exteriorData.length > 0 &&
        exteriorData[0]?.images?.length > 0
          ? `${exteriorData[0].images[0]}`
          : imgExample2,
      category: "exterior",
    },
    {
      ...categoryInfo.business,
      img:
        businessData &&
        businessData.length > 0 &&
        businessData[0]?.images?.length > 0
          ? `${businessData[0].images[0]}`
          : imgExample,
      category: "business",
    },
  ];

  const handleCategoryChange = (
    category: "all" | "interior" | "exterior" | "business",
  ) => {
    dispatch(setCategory(category));
    localStorage.setItem("category", category);
    // Navigate to projects page to see projects in this category
    router.push("/projects");
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as
      | "en"
      | "az"
      | "ru";
    if (storedLanguage) {
      dispatch(setLanguage(storedLanguage));
    }
  }, [dispatch]);

  // Debug log to see what's happening with the images

  return (
    <section className="mx-auto h-full  w-11/12" id="services">
      <SectionHeaderTitle>{headerTitle[language]}</SectionHeaderTitle>

      {/* Desktop view */}
      <div className="hidden w-full items-center justify-between md:flex">
        {serviceCards.map(({ id, img, isReversed, text, category }) => (
          <motion.div
            initial={{ opacity: 0, y: isReversed ? -50 : 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            key={id}
            onClick={() => handleCategoryChange(category as any)}
            className="cursor-pointer max-w-[30%]"
          >
            <ServicesCard
              img={img}
              isReversed={isReversed}
              text={text[language]}
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile view */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto block w-full md:hidden"
      >
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay, Pagination]}
          centeredSlides={true}
          className="overflow-hidden rounded-lg"
          pagination={{
            clickable: true,
          }}
        >
          {serviceCards.map((item, index) => (
            <SwiperSlide
              key={index}
              onClick={() => handleCategoryChange(item.category as any)}
              className="cursor-pointer"
            >
              <div className="h-[46vh]">
                <div className="relative h-[40vh] w-full">
                  <div
                    className={`absolute bottom-1/2 left-10 z-40 translate-y-10 ${playfairDisplayFont800.className} text-3xl tracking-widest text-white drop-shadow-md`}
                  >
                    {item.text[language]}
                  </div>
                  <div className="w-full h-full rounded-3xl overflow-hidden">
                    <img
                      src={
                        typeof item.img === "string" ? item.img : imgExample.src
                      }
                      alt={`${item.category} example`}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default Services;
