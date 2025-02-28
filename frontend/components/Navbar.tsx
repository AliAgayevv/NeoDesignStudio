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
      className={`fixed top-0 z-20 w-full bg-black md:bg-transparent ${montserratFont600.className}`}
      role="navigation"
    >
      <div className="mx-auto flex min-h-24 w-11/12 justify-between p-4 md:justify-normal">
        <Image
          src={languageIcon}
          alt="Language Icon"
          width={32}
          height={32}
          className="relative cursor-pointer"
          onClick={() => setIsLanguageDropdown((prev) => !prev)}
        />
        {isLangugageDropdownOpen && (
          <div className="fixed left-0 top-0 z-50 h-full w-full">
            <div
              className="absolute left-12 top-[97px] flex w-32 flex-col gap-2.5 overflow-hidden shadow-lg"
              ref={languageDropdownRef}
            >
              {["EN", "AZ", "RU"].map((lang) => (
                <p
                  key={lang}
                  className={`flex cursor-pointer justify-between rounded-lg bg-dark_gray px-6 py-4 text-lg text-soft_white transition-all duration-300 ease-in ${
                    language.toUpperCase() === lang
                      ? "bg-white font-bold text-dark_gray"
                      : "hover:scale-125 hover:bg-white hover:text-dark_gray"
                  }`}
                  onClick={() => {
                    dispatch(
                      setLanguage(lang.toLowerCase() as "en" | "az" | "ru"),
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
          className="relative flex cursor-pointer md:hidden"
          aria-label="Toggle Menu"
        />
        {isDropdownMenuOpen && (
          <div className="fixed left-0 top-0 z-50 h-full w-full bg-black bg-opacity-50">
            <div
              ref={dropdownRef}
              className="absolute right-[5%] top-[97px] w-64 overflow-hidden rounded-lg bg-soft_white shadow-lg"
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
                  className="mx-auto block px-6 py-4 text-center text-lg font-[600] text-deep_brown transition-all duration-200 active:bg-deep_brown active:text-light_gray"
                  key={item.id}
                >
                  {item.title[language]}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden h-full items-center justify-between rounded-[32px] bg-[#64606054] p-0 md:ml-[20%] md:flex md:w-4/6 md:p-4">
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
              className={`cursor-pointer px-4 text-lg text-white ${
                pathname === item.path
                  ? "rounded-3xl bg-dark_gray px-16 py-2.5"
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
