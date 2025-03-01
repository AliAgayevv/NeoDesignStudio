"use client";

import Link from "next/link";
import React from "react";
import { Playfair_Display } from "next/font/google";
import { FaCaretRight } from "react-icons/fa6";
import { Montserrat } from "next/font/google";
import logoWhite from "@/public/logoWhite.png";
import logoBlack from "@/public/logoBlack.png";
import Image from "next/image";

const playfairDisplayFont600 = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
});

const montserratFont600 = Montserrat({
  subsets: ["latin"],
  weight: "600",
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
      className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl active:bg-[#101011] active:text-off_white md:hover:border-black md:hover:text-black md:active:text-off_white transition-all duration-300 ease-in-out"
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

const FooterLink: React.FC<FooterLinkProps> = ({ mainTitle, subTitles }) => {
  return (
    <div>
      <h1
        className={`hidden md:flex mb-5  footer_text ${playfairDisplayFont600.className} `}
      >
        {mainTitle}
      </h1>
      <h1
        className={`flex md:hidden mb-5 justify-center items-center footer_text ${montserratFont600.className} `}
      >
        {mainTitle}
      </h1>
      <hr className="flex md:hidden border-1 border-[#867F7F]" />
      <ul
        className={`flex-col gap-5 hidden md:flex ${montserratFont700.className}`}
      >
        {subTitles.map((subTitle) => (
          <li key={subTitle.title} className="flex items-center gap-2">
            <FaCaretRight />
            {subTitle.link.startsWith("/") ? (
              <Link href={subTitle.link}>{subTitle.title}</Link>
            ) : subTitle.link.startsWith("touchEmail") ? (
              <a
                target="_blank"
                href={`mailto:${subTitle.title}?subject=Interior Design&body=Hello.%20I%20want%20to%20design%20my%20house%20.`}
              >
                {subTitle.title}
              </a>
            ) : subTitle.link.startsWith("touchPhone") ? (
              <a href={`tel:${subTitle.title}`}>{subTitle.title}</a>
            ) : (
              <p
                className="hover:cursor-pointer"
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
    link: "https://www.instagram.com/",
  },
  {
    id: 2,
    title: "LinkedIN",
    link: "https://www.linkedin.com/",
  },
  {
    id: 3,
    title: "Behance",
    link: "https://www.behance.net/",
  },
  {
    id: 4,
    title: "Whatsapp",
    link: "https://www.whatsapp.com/",
  },
];

const Footer = () => {
  return (
    <div className="bg-[#F6F4F4] w-full h-auto py-10">
      <footer className="w-11/12 mx-auto text-[#867F7F]">
        <div className="flex flex-nowrap justify-center items-center gap-0 py-3 bg-white border border-[#4a4545] rounded-full px-4 w-full md:w-4/6 mx-auto">
          {footerElements.map((element) => (
            <FooterComponent link={element.link} key={element.id}>
              {element.title}
            </FooterComponent>
          ))}
        </div>
        <div className="flex flex-col ">
          <div className="flex flex-col md:flex-row justify-between mt-5 md:mt-20">
            <div className=" md:flex-col text-[#867F7F]  md:text-left hidden md:flex md:w-2/6 mx-auto md:mx-0">
              <h1
                className={`mb-5 footer_text ${playfairDisplayFont600.className}`}
              >
                Header Ttile
              </h1>
              <p className={`${montserratFont600.className}`}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
                corporis sed amet reiciendis, dolore recusandae excepturi odit,
                nesciunt tempora assumenda, iusto consectetur tempore doloribus
                debitis corrupti error aperiam aspernatur incidunt?
              </p>
            </div>
            {footerLinks.map((footerLink) => (
              <FooterLink
                mainTitle={footerLink.mainTitle}
                subTitles={footerLink.subTitles}
                key={footerLink.id}
              />
            ))}
          </div>
          <hr className="hidden md:flex mt-10 border-1  border-[#131313]" />
          <div className="hidden md:flex justify-between mt-5">
            <Image src={logoBlack} alt="" className="w-28" />
            <button
              className={`rounded-full border-dark_gray bg-light_gray border text-dark_gray py-2.5 px-6 ${montserratFont700.className}`}
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
