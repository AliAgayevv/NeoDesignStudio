import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#F6F4F4] w-full h-auto py-10">
      <footer className="w-11/12 mx-auto text-[#867F7F]">
        <div className="flex flex-nowrap justify-center items-center gap-0 py-3 bg-white border border-[#A59F9F] rounded-full px-4">
          <h3 className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl">
            Instagram
          </h3>
          <h3 className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl">
            LinkedIN
          </h3>
          <h3 className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl">
            Behance
          </h3>
          <h3 className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl">
            Contact
          </h3>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
