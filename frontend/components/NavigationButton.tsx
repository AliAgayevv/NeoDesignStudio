import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Playfair_Display } from "next/font/google";

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
      className={`w-full flex items-center gap-0 text-white rounded-3xl p-0.5 ${playfairDisplayFont800.className}`}
      type="button"
      style={{ backgroundColor }}
    >
      <p
        className="w-40 h-full flex items-center justify-center rounded-3xl p-2 text-sm"
        style={{ backgroundColor: textBackgroundColor }}
      >
        {children}
      </p>
      <span style={{ color: textBackgroundColor }}>
        <MdOutlineKeyboardArrowRight size={32} />
      </span>
    </button>
  );
};

export default NavigationButton;
