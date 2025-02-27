import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import useBreakpoint from "@/utils/hooks/useBreakpoint";

interface NavigationButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textBackgroundColor?: string;
}
const playfairDisplayFont800 = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
});

const NavigationButton: React.FC<NavigationButtonProps> = ({
  children,
  backgroundColor = "#9C9C9C",
  textBackgroundColor = "#463A28",
}) => {
  const isMobile = useBreakpoint();
  return (
    <button
      className={`group relative w-[50vw] flex h-12 md:w-full max-w-[280px] items-center rounded-full p-1 ${playfairDisplayFont800.className} `}
      style={{ backgroundColor }}
      type="button"
    >
      <motion.div
        initial={{ width: "75%" }}
        whileHover={{ width: isMobile ? "75%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-full items-center justify-center rounded-full text-sm text-white"
        style={{ backgroundColor: textBackgroundColor }}
      >
        {children}
      </motion.div>
      <div
        className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full"
        style={{ color: textBackgroundColor }}
      >
        <MdOutlineKeyboardArrowRight
          className="transition-transform md:group-hover:translate-x-0.5"
          size={24}
        />
      </div>
    </button>
  );
};

export default NavigationButton;
