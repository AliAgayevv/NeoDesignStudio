'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SectionHeaderTitle from './SectionHeaderTitle'
import { servicesCardContent } from '@/data/mockDatas'
import ServicesCard from './ServicesCard'
import { selectLanguage, setLanguage } from '@/store/services/languageSlice'

import Image from 'next/image'
import imgExample from '@/public/assets/photos/aboutUsPhoto.jpeg'
import imgExample2 from '@/public/assets/photos/servicesExamplePhoto.png'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Autoplay, Pagination } from 'swiper/modules'
import SwiperCore from 'swiper/core'

import { Playfair_Display } from 'next/font/google'

const playfairDisplayFont800 = Playfair_Display({
  subsets: ['latin'],
  weight: '800',
})

const headerTitle = {
  az: 'Xidmətlər',
  en: 'Services',
  ru: 'Услуги',
}
const images = [
  {
    id: 1,
    img: imgExample,
    text: {
      az: 'Interyer',
      en: 'Interior',
      ru: 'Интерьер',
    },
  },
  {
    id: 2,
    img: imgExample2,
    text: {
      az: 'Eksterer',
      en: 'Exterior',
      ru: 'Экстерьер',
    },
  },
  {
    id: 3,
    img: imgExample,
    text: {
      az: 'Biznes',
      en: 'Business',
      ru: 'Бизнес',
    },
  },
]

const Services = () => {
  SwiperCore.use([Pagination])
  const language = useSelector(selectLanguage)
  const dispatch = useDispatch()

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'en' | 'az' | 'ru'
    if (storedLanguage) {
      dispatch(setLanguage(storedLanguage))
    }
  }, [dispatch])

  return (
    <section className='mx-auto h-full w-11/12' id='services'>
      <SectionHeaderTitle>{headerTitle[language]}</SectionHeaderTitle>
      <div className='hidden w-full items-center justify-between md:flex'>
        {servicesCardContent.map(({ id, img, isReversed, text }) => (
          <ServicesCard key={id} img={img} isReversed={isReversed} text={text[language]} />
        ))}
      </div>
      <div className='mx-auto block w-full md:hidden'>
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay, Pagination]}
          centeredSlides={true}
          className='overflow-hidden rounded-lg'
          pagination={{
            clickable: true,
          }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className='h-[46vh]'>
                <div className='relative h-[40vh] w-full'>
                  <div
                    className={`absolute bottom-1/2 left-10 z-40 translate-y-10 ${playfairDisplayFont800.className} text-3xl tracking-widest`}
                  >
                    {src.text[language]}
                  </div>
                  <Image
                    src={src.img}
                    alt={`Slide ${index}`}
                    layout='fill'
                    className='rounded-3xl'
                    objectFit='cover'
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Services
