import HeroSection from "@/components/HeroSection";
import About from "@/components/About";

export default function Home() {
  return (
    <div className="w-full min-h-screen text-white bg-black">
      <HeroSection />
      <About />
    </div>
  );
}
