"use client";

import Image from "next/image";
import languageIcon from "@/public/assets/icons/languageIcon.svg";
import phoneDropdownIcon from "@/public/assets/icons/phoneDropdownIcon.svg";
import wellDoneIcon from "@/public/assets/icons/wellDoneIcon.svg";
import { useEffect, useRef, useState } from "react";
import useBreakpoint from "@/utils/hooks/useBreakpoint";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage, selectLanguage } from "@/store/services/languageSlice";

import { Montserrat } from "next/font/google";

import { handleGoSomewhere } from "@/utils/handleGoSomewhere";

import { dropdownItems } from "@/data/mockDatas";
const montserratFont600 = Montserrat({ subsets: ["latin"], weight: "600" });

const Navbar = () => {
  const [isDropdownMenuOpen, setIsDropdownMenu] = useState(false);
  const [isLangugageDropdownOpen, setIsLanguageDropdown] = useState(false);
  const isMobile = useBreakpoint();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  useOutsideClick(dropdownRef, () => {
    if (isMobile) setIsDropdownMenu(false);
  });

  useOutsideClick(languageDropdownRef, () => {
    setIsLanguageDropdown(false);
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as
      | "en"
      | "az"
      | "ru";
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  return (
    <nav
      className={`bg-black md:bg-transparent w-full fixed top-0 z-20 ${montserratFont600.className}`}
      role="navigation"
    >
      <div className="w-11/12 flex justify-between md:justify-normal mx-auto p-4 min-h-24">
        <Image
          src={languageIcon}
          alt="Language Icon"
          width={32}
          height={32}
          className="relative cursor-pointer"
          onClick={() => setIsLanguageDropdown((prev) => !prev)}
        />
        {isLangugageDropdownOpen && (
          <div className="w-full h-full fixed top-0 left-0 z-50">
            <div
              className="absolute top-[97px] left-12 w-32 shadow-lg overflow-hidden flex flex-col gap-2.5"
              ref={languageDropdownRef}
            >
              {["EN", "AZ", "RU"].map((lang) => (
                <p
                  key={lang}
                  className={` text-lg py-4 px-6 cursor-pointer flex justify-between bg-[#646060] text-[#F3F1F1] transition-all duration-300 ease-in  rounded-lg ${
                    language.toUpperCase() === lang
                      ? "font-bold bg-white text-[#646060]"
                      : "hover:bg-white hover:text-[#646060] hover:scale-125 "
                  }`}
                  onClick={() => {
                    dispatch(
                      setLanguage(lang.toLowerCase() as "en" | "az" | "ru")
                    );
                    setIsLanguageDropdown(false);
                  }}
                >
                  {lang}
                  {language.toUpperCase() === lang && (
                    <Image src={wellDoneIcon} alt="Well done SVG" />
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
        <Image
          onClick={() => setIsDropdownMenu((prev) => !prev)}
          src={phoneDropdownIcon}
          alt="Phone Dropdown Icon"
          width={32}
          height={32}
          className="flex md:hidden relative cursor-pointer"
          aria-label="Toggle Menu"
        />
        {isDropdownMenuOpen && (
          <div className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full z-50">
            <div
              ref={dropdownRef}
              className="absolute top-[97px] right-[5%] w-64 bg-[#F3F1F1] rounded-lg shadow-lg overflow-hidden"
            >
              {dropdownItems.map((item) => (
                <div
                  onClick={() => {
                    if (item.isNewPage) {
                      window.location.href = "" + item.path;
                    } else {
                      handleGoSomewhere(item.element);
                    }
                  }}
                  className="block py-4 px-6 text-lg text-[#463A28] mx-auto active:bg-[#463A28] active:text-[#E7E7E6] transition-all duration-200 text-center font-[600]"
                  key={item.id}
                >
                  {item.title[language]}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:flex md:w-4/6 justify-between bg-[#64606054] rounded-[32px] h-full p-0 md:p-4 md:ml-[20%] items-center">
          {dropdownItems.map((item) => (
            <p
              key={item.id}
              onClick={() => {
                if (item.isNewPage) {
                  window.location.href = "" + item.path;
                } else {
                  handleGoSomewhere(item.element);
                }
              }}
              className={`text-white text-lg px-4 cursor-pointer ${
                pathname === item.path
                  ? "bg-[#646060] rounded-3xl px-16 py-2.5"
                  : ""
              } `}
            >
              {item.title[language]}{" "}
            </p>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
