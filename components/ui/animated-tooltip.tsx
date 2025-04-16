"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface AnimatedTooltipProps {
  items: {
    id: number
    name: string
    designation: string
    image: string
  }[]
}

export const AnimatedTooltip = ({ items }: AnimatedTooltipProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            className="flex items-center justify-center rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-white transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-full object-cover w-24 h-24"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-900/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {hoveredIndex === idx && (
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-gray-400 text-sm">{item.designation}</p>
              </div>
              <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-gray-900 border-r border-b border-gray-700" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

