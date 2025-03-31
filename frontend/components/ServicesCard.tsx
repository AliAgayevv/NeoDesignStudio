import React from "react";
import Image from "next/image";
import HeaderTitle from "./HeaderTitle";

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
      <img
        src={img}
        alt={`${text} Image`}
        className={`aspect-[9/16] max-h-[60vh] w-full min-w-[30vw] max-w-[30vw] rounded-3xl object-cover ${
          isReversed ? "translate-y-44" : ""
        }`}
      />
      <HeaderTitle classname={`my-auto ${!isReversed ? "translate-y-40" : ""}`}>
        {text}
      </HeaderTitle>
    </div>
  );
};

export default ServicesCard;
