"use client";

import Image from "next/image";
import languageIcon from "@/public/assets/icons/languageIcon.svg";
import phoneDropdownIcon from "@/public/assets/icons/phoneDropdownIcon.svg";
import wellDoneIcon from "@/public/assets/icons/wellDoneIcon.svg";
import { useEffect, useRef, useState } from "react";
import useBreakpoint from "@/utils/hooks/useBreakpoint";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage, selectLanguage } from "@/store/services/languageSlice";

import { Montserrat } from "next/font/google";

import { handleGoSomewhere } from "@/utils/handleGoSomewhere";

import { dropdownItems } from "@/data/mockDatas";
const montserratFont600 = Montserrat({ subsets: ["latin"], weight: "600" });

type NavPath = string | null | boolean;

interface DropdownItem {
  id: number;
  title: {
    en: string;
    az: string;
    ru: string;
    [key: string]: string;
  };
  isNewPage: boolean;
  element: string | null;
  path: NavPath;
}

type Language = "en" | "az" | "ru";

const Navbar = () => {
  const [isDropdownMenuOpen, setIsDropdownMenu] = useState<boolean>(false);
  const [isLangugageDropdownOpen, setIsLanguageDropdown] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    null,
  );
  const isMobile = useBreakpoint();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage) as Language;

  useOutsideClick(dropdownRef, () => {
    if (isMobile) setIsDropdownMenu(false);
  });

  useOutsideClick(languageDropdownRef, () => {
    setIsLanguageDropdown(false);
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  useEffect(() => {
    const savedElement = sessionStorage.getItem("navigateToElement");

    if (savedElement) {
      sessionStorage.removeItem("navigateToElement");
      handleGoSomewhere(savedElement);

      const itemIndex = dropdownItems.findIndex(
        (item: DropdownItem) => item.element === savedElement,
      );
      if (itemIndex !== -1) {
        setSelectedItem(dropdownItems[itemIndex].id);
      }
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const homeItem = (dropdownItems as DropdownItem[]).find(
      (item) =>
        item.title.en === "Home" ||
        (item.element &&
          (item.element === "home" || item.element === "header")),
    );

    if (homeItem) {
      setSelectedItem(homeItem.id);
    }

    const setupObservers = () => {
      const observers: { observer: IntersectionObserver; section: Element }[] =
        [];

      let lastActiveSection: string | null = null;

      const setupObserver = (sectionId: string, itemName: string) => {
        const item = (dropdownItems as DropdownItem[]).find(
          (item) =>
            item.title.en === itemName ||
            (item.element &&
              item.element.toLowerCase() === sectionId.toLowerCase()) ||
            (typeof item.title === "object" &&
              Object.values(item.title).some(
                (val) =>
                  typeof val === "string" &&
                  val.toLowerCase().includes(itemName.toLowerCase()),
              )),
        );

        if (!item) {
          console.log(`Could not find navbar item for ${itemName}`);
          return;
        }

        const section = document.getElementById(sectionId);
        if (!section) {
          console.log(`Could not find section with id "${sectionId}"`);
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                console.log(
                  `${sectionId} section is visible, setting navbar item`,
                );
                setSelectedItem(item.id);
                lastActiveSection = sectionId;
              } else if (lastActiveSection === sectionId) {
                if (homeItem) {
                  setSelectedItem(homeItem.id);
                }
                lastActiveSection = null;
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: "0px",
          },
        );

        observer.observe(section);
        observers.push({ observer, section });
      };

      setupObserver("services", "Services");
      setupObserver("contact", "Contact");

      return () => {
        observers.forEach(({ observer, section }) => {
          observer.unobserve(section);
        });
      };
    };

    const timeoutId = setTimeout(setupObservers, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, language]);

  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(null);

    setTimeout(() => {
      setSelectedItem(item.id);
    }, 10);

    if (item.isNewPage && item.path && typeof item.path === "string") {
      window.location.href = "" + item.path;
    } else {
      if (window.location.pathname !== "/") {
        const elementToNavigate = item.element;

        window.location.href = "/";

        if (elementToNavigate) {
          sessionStorage.setItem("navigateToElement", elementToNavigate);
        }
      } else {
        if (item.element) {
          handleGoSomewhere(item.element);
        }
      }
    }

    if (isMobile) {
      setIsDropdownMenu(false);
    }
  };

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
          className="relative cursor-pointer focus:outline-none"
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
                  className={`flex cursor-pointer justify-between rounded-lg bg-dark_gray px-5 py-2.5 text-lg transition-all duration-300 ease-in focus:outline-none ${
                    language.toUpperCase() === lang
                      ? "bg-white md:bg-transparent font-bold text-[#646060] border-dark_gray border-2 md:hover:rounded-lg"
                      : " md:hover:bg-white md:hover:text-dark_gray text-soft_white md:hover:rounded-lg"
                  }`}
                  onClick={() => {
                    dispatch(setLanguage(lang.toLowerCase() as Language));
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
          className="relative flex cursor-pointer md:hidden focus:outline-none"
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
                  onClick={() => handleItemClick(item)}
                  className={`mx-auto block px-6 py-4 text-center text-lg font-[600] transition-all duration-200 focus:outline-none ${
                    selectedItem === item.id
                      ? "bg-deep_brown text-light_gray"
                      : "text-deep_brown active:bg-deep_brown active:text-light_gray"
                  }`}
                  key={item.id.toString()}
                >
                  {item.title[language] || item.title.en}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden h-full items-center justify-between rounded-full bg-[#64606054] p-0 md:mx-auto md:flex md:w-4/6 md:p-4">
          {dropdownItems.map((item) => (
            <p
              key={item.id.toString()}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer md:px-4 lg:px-12 w-full text-center text-lg text-white focus:outline-none ${
                selectedItem === item.id
                  ? "rounded-full bg-dark_gray px-16 py-2.5"
                  : pathname === item.path && !selectedItem
                    ? "rounded-full bg-dark_gray px-16 py-2.5"
                    : ""
              }`}
            >
              {item.title[language] || item.title.en}{" "}
            </p>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
