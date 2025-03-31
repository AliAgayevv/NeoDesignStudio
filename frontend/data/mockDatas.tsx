import { FaInstagram, FaBehance, FaPinterest } from "react-icons/fa";

export const socialMedias = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/neodesign_studio/",
    icon: <FaInstagram size={24} />,
  },
  {
    name: "Behance",
    url: "https://www.behance.net/orxanagayev",
    icon: <FaBehance size={24} />,
  },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com/NeoDesign_Studio/",
    icon: <FaPinterest size={24} />,
  },
];

export const heroContent = {
  en: {
    mainTitle: "Welcome to Our Website",
  },
  az: {
    mainTitle: "Saytımıza Xoş Gəlmisiniz",
  },
  ru: {
    mainTitle: "Добро пожаловать на наш сайт",
  },
};

export const dropdownItems = [
  {
    id: 1,
    title: {
      en: "Home",
      az: "Ana Səhifə",
      ru: "Главная",
    },
    isNewPage: true,
    element: null,
    path: "/",
  },
  {
    id: 2,
    title: {
      en: "Projects",
      az: "Layihələr",
      ru: "Проекты",
    },
    isNewPage: true,
    element: null,
    path: "/projects",
  },
  {
    id: 3,
    title: {
      en: "Services",
      az: "Xidmətlər",
      ru: "Услуги",
    },
    isNewPage: false,
    element: "services",
    path: null,
  },
  {
    id: 4,
    title: {
      en: "Contact",
      az: "Əlaqə",
      ru: "Конт",
    },
    isNewPage: false,
    element: "contact",
    path: false,
  },
];

import servicesExamplePhoto from "@/public/assets/photos/servicesExamplePhoto.png";
