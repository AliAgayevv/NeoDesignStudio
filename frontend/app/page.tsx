import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="w-full min-h-screen text-white bg-black">
      <HeroSection />
      <About />
      <Services />
    </div>
  );
}
