import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";

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
  return (
    <button
      className={`group relative flex h-12 w-full max-w-[280px] items-center rounded-full p-1 ${playfairDisplayFont800.className} `}
      style={{ backgroundColor }}
      type="button"
    >
      <motion.div
        initial={{ width: "75%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-full rounded-full justify-center items-center text-sm text-white"
        style={{ backgroundColor: textBackgroundColor }}
      >
        {children}
      </motion.div>
      <div
        className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full"
        style={{ color: textBackgroundColor }}
      >
        <MdOutlineKeyboardArrowRight
          className="text-white transition-transform group-hover:translate-x-0.5"
          size={24}
        />
      </div>
    </button>
  );
};

export default NavigationButton;
