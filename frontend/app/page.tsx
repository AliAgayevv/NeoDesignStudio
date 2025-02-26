import HeroSection from '@/components/HeroSection'
import About from '@/components/About'
import Services from '@/components/Services'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <div className='min-h-screen w-full bg-black text-white'>
      <HeroSection />
      <About />
      <Services />
      <div className='w-full bg-black md:h-[400px]'></div>
      <Contact />
    </div>
  )
}
