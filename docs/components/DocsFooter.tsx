import React from 'react'
import { FaHeart, FaReact } from 'react-icons/fa'

export function DocsFooter() {
  return (
    <div className="w-full h-24 bg-gradient-to-r from-base-300 to-base-200 flex items-center justify-center px-20 py-8 text-white">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">Made with</span>
        <FaHeart className="text-red-500 animate-pulse" />
        <span className="text-lg">and</span>
        <FaReact className="text-blue-500 animate-spin" />
        <span className="text-lg">by</span>
        <span className="font-extrabold">Emil Ölund</span>
      </div>
      <div className="ml-2 text-sm opacity-70">© 2024 MIT</div>
    </div>
  )
}
