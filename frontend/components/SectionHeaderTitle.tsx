import React from "react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";

interface SectionHeaderTitleProps {
  children: React.ReactNode;
}

const montserratFont700 = Montserrat({ subsets: ["latin"], weight: "700" });

const SectionHeaderTitle: React.FC<SectionHeaderTitleProps> = ({
  children,
}) => {
  return (
    <motion.h1
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={`header_text text-clip font-[600] break-words uppercase tracking-wider ${montserratFont700.className}
        md:bg-gradient-to-r md:from-white md:to-black md:text-transparent bg-clip-text
      `}
    >
      {children}
    </motion.h1>
  );
};

export default SectionHeaderTitle;
