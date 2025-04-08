import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Image from "next/image";
import desingBeyondLimits from "../public/assets/icons/designBeyondLimitsIcon.svg";
import { Playfair_Display } from "next/font/google";

const playfairDisplayFont600 = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
});

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <HeroSection />
      <About />
      <Services />
      <div className="w-full bg-black md:h-[400px]"></div>
      <Contact />
      <div className="h-full w-full mt-40 bg-black mx-auto hidden md:block">
        <div className="flex items-center mx-auto w-full gap-10">
          <hr className="w-[45%] h-2" />
          <Image src={desingBeyondLimits} alt="design beyond limits" />
          <hr className="w-[45%] h-2" />
        </div>
        <h1
          className={`${playfairDisplayFont600.className} landing_bottom_text text-center`}
        >
          Design Beyond Limits!
        </h1>
      </div>
      <div className="bg-black w-full h-[200px] hidden md:block"></div>
    </div>
  );
}
