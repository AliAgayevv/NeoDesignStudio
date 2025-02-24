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
      className={`flex flex-col items-center translate-y-4 h-[99vh] ${
        isReversed ? "flex-col-reverse" : ""
      }`}
    >
      <Image
        src={img}
        alt={`${text} Image`}
        className={`aspect-[9/16] min-w-[30vw] max-w-[30vw] w-full max-h-[60vh] rounded-3xl object-cover ${
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
