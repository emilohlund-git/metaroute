'use client'

import { useEffect, useState } from 'react'
import { RiMenu3Line } from 'react-icons/ri'
import docs from '../docs.json'
import SmoothScrollLink from '@/components/SmoothScrollLink'
import { IoIosMenu } from 'react-icons/io'

type Props = {
  activeTab: string
}

export function DocsActivePageMenu({ activeTab }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [menuItems, setMenuItems] = useState<
    {
      title: string
      url: string
    }[]
  >([])

  useEffect(() => {
    setMenuItems(docs[activeTab as keyof typeof docs].subtitles)
  }, [activeTab])

  return (
    <div
      className={`fixed right-0 transition-all duration-300 ease-in-out ${
        isHovered ? 'w-72' : 'w-12'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`transition-all text-3xl pt-4 -ml-3 text-base-content w-12 h-12 flex items-center justify-center rounded-l-full ${
          isHovered ? 'scale-0' : 'scale-100'
        }`}
      >
        {/* Replace "Icon" with your actual icon */}
        <IoIosMenu />
      </div>
      <ul
        className={`menu bg-base-200 rounded-box -mt-12 text-base-content overflow-hidden ${
          isHovered ? 'block' : 'hidden'
        }`}
      >
        <li>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <SmoothScrollLink
                  id={item.title}
                  key={index}
                  href={`${window.location.pathname}#${item.title
                    .split(' ')
                    .join('-')
                    .toLowerCase()}`}
                >
                  {item.title}
                </SmoothScrollLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  )
}
