"use client";

import Image from "next/image";
import languageIcon from "@/public/assets/icons/languageIcon.svg";
import phoneDropdownIcon from "@/public/assets/icons/phoneDropdownIcon.svg";
import { useEffect, useRef, useState } from "react";
import useBreakpoint from "@/utils/hooks/useBreakpoint";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage, selectLanguage } from "@/store/services/languageSlice";

const navbarElements = {
  en: [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" },
  ],
  az: [
    { title: "Ana Səhifə", href: "/" },
    { title: "Layihələr", href: "/projects" },
    { title: "Xidmətlər", href: "/services" },
    { title: "Əlaqə", href: "/contact" },
  ],
  ru: [
    { title: "Главная", href: "/" },
    { title: "Проекты", href: "/projects" },
    { title: "Услуги", href: "/services" },
    { title: "Контакты", href: "/contact" },
  ],
};

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
    <nav className="bg-black w-full" role="navigation">
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
              className="absolute top-[97px] left-12 w-32 bg-[#F3F1F1] rounded-lg shadow-lg overflow-hidden flex flex-col"
              ref={languageDropdownRef}
            >
              {["EN", "AZ", "RU"].map((lang) => (
                <p
                  key={lang}
                  className={`text-[#463A28] text-lg py-4 px-6 cursor-pointer ${
                    language.toUpperCase() === lang ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    dispatch(
                      setLanguage(lang.toLowerCase() as "en" | "az" | "ru")
                    );
                    setIsLanguageDropdown(false);
                  }}
                >
                  {lang}
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
              {navbarElements[language].map((item, index) => (
                <div key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setIsDropdownMenu(false)}
                    className="block py-4 px-6 text-lg text-[#463A28] mx-auto active:bg-[#463A28] active:text-[#E7E7E6] transition-all duration-200 text-center font-[600]"
                  >
                    {item.title}
                  </Link>
                  {index < navbarElements[language].length - 1 && (
                    <div className="h-px bg-[#463A28]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:flex md:w-4/6 justify-evenly bg-[#646060] rounded-[32px] h-full p-0 md:p-4 md:ml-[20%]">
          {navbarElements[language].map((item, index) => (
            <Link key={index} href={item.href}>
              <p
                className={`text-white text-lg px-4 ${
                  pathname === item.href ? "underline" : ""
                }`}
              >
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <hr />
    </nav>
  );
};

export default Navbar;
