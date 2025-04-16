"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverEffectProps {
  items: {
    title: string
    description: string
    icon?: React.ReactNode
  }[]
  className?: string
}

export function HoverEffect({ items, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerDimensions({ width, height })
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerDimensions({ width, height })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - left,
        y: e.clientY - top,
      })
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="relative group h-full w-full p-6 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          initial="initial"
          whileHover="hover"
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.02 },
          }}
        >
          <div
            style={{
              background:
                hoveredIndex === idx
                  ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                  : "none",
              transition: "background 0.3s ease",
            }}
            className="absolute inset-0"
          />

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />

          <div className="relative z-10">
            <div className="mb-4 text-white bg-gray-800 rounded-lg p-3 w-fit">{item.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.description}</p>
          </div>

          <motion.div
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-500 via-white to-gray-500"
          />
        </motion.div>
      ))}
    </div>
  )
}

