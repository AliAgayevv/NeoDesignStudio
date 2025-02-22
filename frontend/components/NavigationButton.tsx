import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface NavigationButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textBackgroundColor?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  children,
  backgroundColor = "#9C9C9C",
  textBackgroundColor = "#463A28",
}) => {
  return (
    <button
      className="w-full flex items-center gap-0 text-white rounded-3xl p-0.5"
      type="button"
      style={{ backgroundColor }}
    >
      <p
        className="w-40 h-full flex items-center justify-center rounded-3xl p-2"
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
