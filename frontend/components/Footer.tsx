"use client";

import Link from "next/link";
import React from "react";
import { Playfair_Display } from "next/font/google";
import { FaCaretRight } from "react-icons/fa6";
import { Montserrat } from "next/font/google";
import logoBlack from "@/public/logoBlack.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";
import { handleGoSomewhere } from "@/utils/handleGoSomewhere";

const motto = {
  en: "You imagine, we make it real.",
  az: "Siz xəyal edin, biz gerçəkləşdirək.",
  ru: "Вы мечтаете, мы воплощаем.",
};

const playfairDisplayFont600 = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
});

const montserratFont700 = Montserrat({
  subsets: ["latin"],
  weight: "700",
});

interface FooterComponentProps {
  children: React.ReactNode;
  link: string;
}

const FooterComponent: React.FC<FooterComponentProps> = ({
  children,
  link,
}) => {
  return (
    <a
      target="_blank"
      href={link}
      className={`flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 2xl:py-5 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-xl xl:text-2xl 2xl:text-3xl active:bg-[#101011] active:text-off_white md:hover:border-black md:hover:text-black md:active:text-off_white transition-all duration-300 ease-in-out ${playfairDisplayFont600.className}`}
    >
      {children}
    </a>
  );
};

const footerLinks = [
  {
    id: 1,
    mainTitle: "Company",
    subTitles: [
      {
        id: 1,
        title: "About Us",
        link: "about",
      },
      {
        id: 2,
        title: "Portfolio",
        link: "/projects",
      },
    ],
  },
  {
    id: 2,
    mainTitle: "Services",
    subTitles: [
      {
        id: 1,
        title: "Exterior",
        link: "/projects",
      },
      {
        id: 2,
        title: "Interior",
        link: "/projects",
      },
      {
        id: 3,
        title: "Business",
        link: "/projects",
      },
    ],
  },
  {
    id: 3,
    mainTitle: "Contact",
    subTitles: [
      {
        id: 1,
        title: "+994 51 897 01 15",
        link: "touchPhone",
      },
      {
        id: 2,
        title: "neodesignstudio2019@gmail.com",
        link: "touchEmail",
      },
    ],
  },
];

interface FooterLinkProps {
  mainTitle: string;
  subTitles: { title: string; link: string }[];
}

// Simple mobile footer component that matches the design in the photo
const SimpleMobileFooter: React.FC = () => {
  const socialIcons = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#555555">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      link: "https://www.instagram.com/neodesign_studio/",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#555555">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
      link: "https://www.pinterest.com/NeoDesign_Studio/",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#555555">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
        </svg>
      ),
      link: "https://www.behance.net/orxanagayev",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#555555">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      link: "https://wa.link/r4z1i6",
    },
  ];

  const navigationLinks = [
    { title: "About Us", link: null, loc: "about" },
    { title: "Portfolio", link: "/projects", loc: null },
    { title: "Services", link: null, loc: "services" },
    { title: "Contact", link: null, loc: "contact" },
  ];

  const handleNavClick = (item: {
    title: string;
    link: string | null;
    loc: string | null;
  }) => {
    if (item.link) {
      window.location.href = item.link;
    } else if (item.loc) {
      handleGoSomewhere(item.loc);
    }
  };

  return (
    <div className="w-full bg-gray-100 rounded-t-3xl px-6 py-8 flex flex-col items-center text-[#555555]">
      <div className="mb-8">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 14L12 9L17 14"
            stroke="#555555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="w-full flex flex-col gap-4 mb-12">
        {navigationLinks.map((item) => (
          <div
            key={item.title}
            className="text-[#555555] text-xl text-center cursor-pointer"
            onClick={() => handleNavClick(item)}
          >
            {item.title}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mb-8">
        {socialIcons.map((item, index) => (
          <a
            href={item.link}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-8 h-8 opacity-80">{item.icon}</div>
          </a>
        ))}
      </div>

      <div className="w-full flex gap-3 flex-col items-center text-sm text-[#777777] mt-4">
        <p>Privacy & terms</p>
        <a href="https://www.linkedin.com/in/nazrin-mahmudlu/" target="_blank">
          <p>
            Designed by{" "}
            <span className="underline underline-offset-2">
              Nazrin Mahmudlu
            </span>
          </p>
        </a>
      </div>
    </div>
  );
};

// Original desktop version
const DesktopFooterLink: React.FC<FooterLinkProps> = ({
  mainTitle,
  subTitles,
}) => {
  return (
    <div>
      <h1
        className={`hidden md:flex mb-5 footer_text ${playfairDisplayFont600.className} `}
      >
        {mainTitle}
      </h1>
      <ul
        className={`flex-col gap-5 hidden md:flex  ${montserratFont700.className}`}
      >
        {subTitles.map((subTitle) => (
          <li
            key={subTitle.title}
            className="flex items-center gap-2 md:hover:underline-offset-2 md:hover:underline md:cursor-pointer"
          >
            <FaCaretRight />
            {subTitle.link.startsWith("/") ? (
              <Link href={subTitle.link}>{subTitle.title}</Link>
            ) : subTitle.link.startsWith("touchEmail") ? (
              <a
                className="md:hover:underline-offset-2 md:hover:underline md:cursor-pointer"
                target="_blank"
                href={`mailto:${subTitle.title}?subject=Interior Design&body=Hello.%20I%20want%20to%20design%20my%20house%20.`}
              >
                {subTitle.title}
              </a>
            ) : subTitle.link.startsWith("touchPhone") ? (
              <a
                className="md:hover:underline-offset-2 md:hover:underline md:cursor-pointer "
                href={`tel:${subTitle.title}`}
              >
                {subTitle.title}
              </a>
            ) : (
              <p
                className="md:hover:cursor-pointer"
                onClick={() => {
                  const element = document.getElementById(subTitle.link);
                  if (element) {
                    const elementTopPosition =
                      window.pageYOffset + element.getBoundingClientRect().top;
                    window.scrollTo({
                      top: elementTopPosition,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {subTitle.title}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const footerElements = [
  {
    id: 1,
    title: "Instagram",
    link: "https://www.instagram.com/neodesign_studio/",
  },
  {
    id: 2,
    title: "Pinterest",
    link: "https://www.pinterest.com/NeoDesign_Studio/",
  },
  {
    id: 3,
    title: "Behance",
    link: "https://www.behance.net/orxanagayev",
  },
  {
    id: 4,
    title: "Whatsapp",
    link: "https://wa.link/r4z1i6",
  },
];

const Footer = () => {
  const lang = useSelector(selectLanguage);

  return (
    <div className="bg-[#F6F4F4] w-full h-auto py-10">
      <footer className="w-11/12 mx-auto text-[#867F7F]">
        <div className="flex-nowrap justify-center items-center gap-0 py-3 bg-white border border-[#4a4545] rounded-full px-4 hidden md:flex md:w-4/6 mx-auto">
          {footerElements.map((element) => (
            <FooterComponent link={element.link} key={element.id}>
              {element.title}
            </FooterComponent>
          ))}
        </div>
        <div className="flex flex-col">
          {/* Mobile Footer - Use the fixed component that matches the design */}
          <div className="md:hidden ">
            <SimpleMobileFooter />
          </div>

          {/* Original desktop footer - only visible on desktop */}
          <div className="hidden md:flex md:flex-row justify-between mt-20">
            <div className="md:flex-col text-[#867F7F] md:text-left md:flex md:w-1/6 mx-auto md:mx-0">
              <Image src={logoBlack} alt="" className="w-40 mb-5 " />
              <p className={`${playfairDisplayFont600.className}`}>
                {motto[lang]}
              </p>
            </div>
            {footerLinks.map((footerLink) => (
              <DesktopFooterLink
                mainTitle={footerLink.mainTitle}
                subTitles={footerLink.subTitles}
                key={footerLink.id}
              />
            ))}
          </div>
          <hr className="hidden md:flex mt-10 border-1 border-[#131313]" />
          <div className="hidden md:flex justify-between mt-5 items-center">
            <a
              href="https://www.linkedin.com/in/nazrin-mahmudlu/"
              target="_blank"
            >
              Designed by{" "}
              <span className="underline underline-offset-2">
                Nazrin Mahmudlu
              </span>
            </a>
            <button
              className={`rounded-full border-dark_gray bg-light_gray border md:hover:bg-dark_gray md:hover:text-light_gray transition-colors duration-300 cursor-pointer text-dark_gray py-2.5 px-6 ${montserratFont700.className}`}
              onClick={() => handleGoSomewhere("contact")}
            >
              Get a quote
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
