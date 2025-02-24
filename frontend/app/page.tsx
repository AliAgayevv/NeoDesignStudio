import HeroSection from '@/components/HeroSection'
import About from '@/components/About'
import Services from '@/components/Services'

export default function Home() {
  return (
    <div className='min-h-screen w-full bg-black text-white'>
      <HeroSection />
      <About />
      <Services />
    </div>
  )
}
