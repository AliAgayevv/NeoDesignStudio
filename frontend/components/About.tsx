"use client";

import React from "react";
import HeaderTitle from "./HeaderTitle";
import Image from "next/image";
import aboutUsPhoto from "../public/assets/photos/aboutUsPhoto.jpeg";

const About = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = React.useState(false);
  return (
    <div className="w-11/12 mx-auto mt-32 h-screen ">
      <HeaderTitle>About</HeaderTitle>
      <div className="flex flex-col md:flex-row justify-between w-full gap-8">
        <div className="flex flex-col gap-5 text-[#E7E7E6] text-xl md:w-2/3">
          <h2 className="text-3xl font-semibold">How we can help</h2>
          <p className="text-lg text-right">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Assumenda
            dolorem, at obcaecati modi fugiat itaque ad odit quidem porro!
            Officiis reiciendis exercitationem minima, quas cumque consequatur
            at nisi sit omnis.
          </p>
          {isLearnMoreOpen && (
            <div>
              <p className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Assumenda dolorem, at obcaecati modi fugiat itaque ad odit
                quidem porro! Officiis reiciendis exercitationem minima, quas
                cumque consequatur at nisi sit omnis.
              </p>
            </div>
          )}
          <p
            className="underline font-bold cursor-pointer self-end"
            onClick={() => setIsLearnMoreOpen((prev) => !prev)}
          >
            Learn More
          </p>
        </div>
        <div className="w-full md:w-1/2 relative overflow-hidden md:overflow-visible">
          <div className="absolute bottom-6 left-4 md:bottom-12 md:left-10 z-0 w-full h-full border border-[#955C22] rounded-lg shadow-md  overflow-hidden " />

          <Image
            alt="Learn More Image"
            src={aboutUsPhoto}
            className="relative z-10 object-cover rounded-lg shadow-lg md:min-h-[600px] w-full h-auto"
            // object-cover rounded-lg shadow-lg md:min-h-[600px] h-auto w-full
          />
        </div>
      </div>
    </div>
  );
};

export default About;
