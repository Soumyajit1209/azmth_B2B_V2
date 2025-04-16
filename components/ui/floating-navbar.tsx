"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
  }[]
  className?: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Determine active section based on scroll position
      const sections = navItems.map((item) => item.link.replace("#", ""))

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveItem(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [navItems])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn("fixed top-4 inset-x-0 mx-auto z-50 flex justify-center", className)}
        >
          <div className="flex items-center justify-center space-x-4 bg-black/60 backdrop-blur-md border border-gray-800 px-4 py-3 rounded-full">
            {navItems.map((navItem, idx) => (
              <Link
                key={`nav-item-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors",
                  activeItem === navItem.link.replace("#", "") && "text-white",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.querySelector(navItem.link)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                {activeItem === navItem.link.replace("#", "") && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gray-800 rounded-full"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{navItem.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

