import React from "react";
import { Montserrat } from "next/font/google";

interface SectionHeaderTitleProps {
  children: React.ReactNode;
}

const montserratFont700 = Montserrat({ subsets: ["latin"], weight: "700" });

const SectionHeaderTitle: React.FC<SectionHeaderTitleProps> = ({
  children,
}) => {
  return (
    <h1
      className={`header_text text-clip font-[600] break-words uppercase tracking-wider ${montserratFont700.className}
        md:bg-gradient-to-r md:from-white  md:to-black md:text-transparent bg-clip-text
        
      `}
    >
      {children}
    </h1>
  );
};

export default SectionHeaderTitle;
