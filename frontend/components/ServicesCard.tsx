import React from "react";
import HeaderTitle from "./HeaderTitle";
import { motion } from "framer-motion";

interface ServicesCardProps {
  img: any;
  text: any;
  isReversed?: boolean;
}

const ServicesCard: React.FC<ServicesCardProps> = ({
  img,
  text,
  isReversed = false,
}) => {
  return (
    <div
      className={`flex h-[99vh] translate-y-4 flex-col items-center ${
        isReversed ? "flex-col-reverse" : ""
      }`}
    >
      <div
        className={`overflow-hidden rounded-3xl w-full min-w-[30vw] max-w-[30vw] ${
          isReversed ? "translate-y-44" : ""
        }`}
      >
        <img
          src={img}
          alt={`${text} Image`}
          className={`aspect-[9/16] max-h-[60vh] w-full object-cover transition-transform duration-300 md:hover:scale-110`}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: isReversed ? -50 : 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <HeaderTitle
          classname={`my-auto ${!isReversed ? "translate-y-40" : ""}`}
        >
          {text}
        </HeaderTitle>
      </motion.div>
    </div>
  );
};

export default ServicesCard;
