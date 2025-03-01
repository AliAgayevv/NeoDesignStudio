import React from "react";

interface FooterComponentProps {
  children: React.ReactNode;
  link: string;
}

const FooterComponent: React.FC<FooterComponentProps> = ({
  children,
  link,
}) => {
  return (
    <a
      target="_blank"
      href={link}
      className="flex justify-center items-center text-center h-10 w-60 md:w-1/4 py-2 md:h-full md:py-3 border border-[#A59F9F] rounded-full px-3 text-[14px] md:text-2xl active:bg-[#101011] active:text-off_white md:hover:border-black md:hover:text-black transition-all duration-300 ease-in-out"
    >
      {children}
    </a>
  );
};

const footerElements = [
  {
    id: 1,
    title: "Instagram",
    link: "https://www.instagram.com/",
  },
  {
    id: 2,
    title: "LinkedIN",
    link: "https://www.linkedin.com/",
  },
  {
    id: 3,
    title: "Behance",
    link: "https://www.behance.net/",
  },
  {
    id: 4,
    title: "Whatsapp",
    link: "https://www.whatsapp.com/",
  },
];

const Footer = () => {
  return (
    <div className="bg-[#F6F4F4] w-full h-auto py-10">
      <footer className="w-11/12 mx-auto text-[#867F7F]">
        <div className="flex flex-nowrap justify-center items-center gap-0 py-3 bg-white border border-[#A59F9F] rounded-full px-4">
          {footerElements.map((element) => (
            <FooterComponent link={element.link} key={element.id}>
              {element.title}
            </FooterComponent>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
