import React from 'react'
import { Playfair_Display } from 'next/font/google'

interface HeaderTitleProps {
  children: React.ReactNode
  classname: string
}

const playfairDisplayFont600 = Playfair_Display({
  subsets: ['latin'],
  weight: '600',
})

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children, classname = '' }) => {
  // Global css de header_text ucun clamp ile olcu yarat, jasper website ornekden bax
  return (
    <h1 className={`text-4xl font-[600] ${classname} ${playfairDisplayFont600.className}`}>
      {children}
    </h1>
  )
}

export default HeaderTitle
